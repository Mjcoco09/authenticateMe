const express = require("express");
const { Spot, SpotImage, Review, sequelize, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const router = express.Router();
const validSpotOwner = async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot not found" });
  }

  if (spot.ownerId !== user.id) {
    return res.status(403).json;
  }
};
const validSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

//get all spots
router.get("/", async (req, res) => {
  const filter = {
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [
        sequelize.literal(
          `(SELECT "url" FROM "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
        ),
        "previewImage",
      ],
      [
        sequelize.literal(
          `(SELECT AVG("stars") FROM "Reviews" WHERE "Reviews"."spotId" = "Spot"."id")`
        ),
        "avgRating",
      ],
    ],
    include: [
      {
        model: SpotImage,
        attributes: [],
      },
      {
        model: Review,
        attributes: [],
      },
    ],
  };
  const spots = await Spot.findAll(filter);
  return res.json({ Spots: spots });
});

router.get("/current", requireAuth, async (req, res, next) => {
  const currentUserId = req.user.id;
  const filter = {
    where: { ownerId: currentUserId },
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [
        sequelize.literal(
          `(SELECT "url" FROM "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
        ),
        "previewImage",
      ],
      [
        sequelize.literal(
          `(SELECT AVG("stars") FROM "Reviews" WHERE "Reviews"."spotId" = "Spot"."id")`
        ),
        "avgRating",
      ],
    ],
    include: [
      {
        model: SpotImage,
        attributes: [],
      },
      {
        model: Review,
        attributes: [],
      },
    ],
  };
  const spots = await Spot.findAll(filter);
  return res.json({ Spots: spots });
});

router.get("/:spotId", async (req, res, next) => {
  const thisSpot = Number(req.params.spotId);

  const filter = {
    where: {
      id: thisSpot,
    },
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [
        sequelize.literal(
          `(SELECT AVG("stars") FROM "Reviews" WHERE "Reviews"."spotId" = "Spot"."id") `
        ),
        "avgStarRating",
      ],
      [
        sequelize.literal(
          '(SELECT COUNT("id") FROM "Reviews" WHERE "Reviews"."spotId" = "Spot"."id")'
        ),
        "numReviews",
      ],
    ],
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: Review,
        attributes: [],
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  };
  const spot = await Spot.findOne(filter);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  return res.json(spot);
});

router.post("/", [requireAuth, validSpot], async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const ownerId = req.user.id;
  const spot = await Spot.create({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    ownerId,
  });
  return res.json(spot);
});

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;
  const thisSpotId = Number(req.params.spotId);
  const { user } = req;
  const spot = await Spot.findByPk(thisSpotId);

  if (!spot) {
    const err = new Error();
    err.message = "Spot couldn't be found";
    err.status = 404;
    return next(err);
  }
  if (spot.ownerId !== user.id) {
    return res.json({ error: "You are not authorized to perform this action" });
  }
  const image = await SpotImage.create({
    url,
    preview,
  });

  const filterImage = {
    id: image.id,
    url: image.url,
    preview: image.preview,
  };

  return res.json(filterImage);
});

router.put("/:spotId", [requireAuth, validSpot], async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const thisSpotId = Number(req.params.spotId);
  const spot = await Spot.findByPk(thisSpotId);
  if (!spot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    return next(err);
  }
  if (spot.ownerId !== req.user.id) {
    return res.json({ error: "You are not authorized to perform this action" });
  }
  if (!spot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    return err;
  }
  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save();
  return res.json(spot);
});


router.delete("/:spotId",requireAuth,async(req,res,next)=>{
  const thisSpotId = Number(req.params.spotId);
  const spot = await Spot.findByPk(thisSpotId);
  if(!spot){
    const err = new Error
    err.status = 404
    err.message = "Spot couldn't be found"
    return next(err)
  }
  if (spot.ownerId !== req.user.id) {
    return res.json({ error: "You are not authorized to perform this action" });
  }
  await spot.destroy();
  return res.json({ message: "Successfully deleted" });
})
module.exports = router;
