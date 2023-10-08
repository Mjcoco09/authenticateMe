const express = require("express");
const { Spot, SpotImage, Review, sequelize, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();

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

router.post('/',requireAuth, async (req,res)=>{
  const {address,city,state,country,lat,lng,name,description,price} = req.body
  const spot = await Spot.create({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })
  return res.json(spot)
})





module.exports = router;
