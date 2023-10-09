const express = require("express");
const {
  Spot,
  SpotImage,
  Review,
  sequelize,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { Op } = require("sequelize");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 20;
  const minLat = parseFloat(req.query.minLat);
  const maxLat = parseFloat(req.query.maxLat);
  const minLng = parseFloat(req.query.minLng);
  const maxLng = parseFloat(req.query.maxLng);
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || 0;


  if (page < 1 || size < 1 || minLat > maxLat || minLng > maxLng || minPrice > maxPrice) {
    const errors = {
      page: page < 1 ? "Page must be greater than or equal to 1" : undefined,
      size: size < 1 ? "Size must be greater than or equal to 1" : undefined,
      minLat: minLat > maxLat ? "Minimum latitude is invalid" : undefined,
      maxLat: undefined,
      minLng: minLng > maxLng ? "Minimum longitude is invalid" : undefined,
      maxLng: undefined,
      minPrice: minPrice > maxPrice ? "Minimum price must be greater than or equal to 0" : undefined,
      maxPrice: undefined,
    };

    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = errors;

    return next(err);
  }

  const query = {
    where: {},
  };

  if (minLat && maxLat) {
    query.where.lat = { [Op.between]: [minLat, maxLat] };
  }

  if (minLng && maxLng) {
    query.where.lng = { [Op.between]: [minLng, maxLng] };
  }

  if (minPrice && maxPrice) {
    query.where.price = { [Op.between]: [minPrice, maxPrice] };
  }

  const spots = await Spot.findAndCountAll({
    ...query,
    limit: size,
    offset: (page - 1) * size,
  });

  res.json({
    Spots: spots.rows,
    page,
    size,
  });
});


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
const validReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
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
      // [
      //   sequelize.literal(
      //     `(SELECT "url" FROM "Images" AS "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
      //   ),
      //   "previewImage",
      // ],
      // [
      //   sequelize.literal(
      //     `(SELECT AVG("stars") FROM "Review" WHERE "Review"."spotId" = "Spot"."id")`
      //   ),
      //   "avgRating",
      // ]
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
          `(SELECT "url" FROM "Images" AS "SpotImage" WHERE "SpotImage"."spotId" = "Spot"."id" AND "SpotImage"."preview" = true LIMIT 1)`
        ),
        "previewImage",
      ],
      // [
      //   sequelize.literal(
      //     `(SELECT AVG("stars") FROM "Review" WHERE "Review"."spotId" = "Spot"."id")`
      //   ),
      //   "avgRating",
      // ],
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


  // const spots = await Spot.findAll(filter);
  // for (const spot of spots) {
  //   const avgRating = await Review.findOne({
  //     where: { spotId: spot.id },
  //     attributes: [[sequelize.fn("avg", sequelize.col("stars")), "avgRating"]],
  //     raw: true,
  //   });

  //   spot.dataValues.avgRating = avgRating?.avgRating || null;
  // }

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
      // [
      //   sequelize.literal(
      //     `(SELECT AVG("stars") FROM "Review" WHERE "Review"."spotId" = "Spot"."id") `
      //   ),
      //   "avgStarRating",
      // ],
      // [
      //   sequelize.literal(
      //     '(SELECT COUNT("id") FROM "Review" WHERE "Review"."spotId" = "Spot"."id")'
      //   ),
      //   "numReviews",
      // ],
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
    return res.json({ error: "forbidden" });
  }
  const image = await SpotImage.create({
    spotId: thisSpotId,
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
    return res.json({ error: "forbidden" });
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

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const thisSpotId = Number(req.params.spotId);
  const spot = await Spot.findByPk(thisSpotId);
  if (!spot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    return next(err);
  }
  if (spot.ownerId !== req.user.id) {
    return res.json({ error: " forbidden" });
  }
  await spot.destroy();
  return res.json({ message: "Successfully deleted" });
});

router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = Number(req.params.spotId);
  const isSpot = await Spot.findByPk(spotId);
  if (!isSpot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    return next(err);
  }
  const filter = {
    where: {
      spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  };
  const review = await Review.findAll(filter);

  return res.json({ Reviews: review });
});

router.post(
  "/:spotId/reviews",
  [requireAuth, validReview],
  async (req, res, next) => {
    const thisSpotId = Number(req.params.spotId);
    const userId = req.user.id;
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(thisSpotId);
    if (!spot) {
      const err = new Error();
      err.status = 404;
      err.message = "Spot couldn't be found";
      return next(err);
    }
    const existingReview = await Review.findOne({
      where: {
        userId,
        spotId: thisSpotId,
      },
    });

    if (existingReview) {
      const err = new Error();
      err.status = 500;
      err.message = "User already has a review for this spot";
      return next(err);
    }
    const newReview = await Review.create({
      spotId: thisSpotId,
      userId,
      review,
      stars,
    });
    return res.json(newReview);
  }
);

router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const spotId = Number(req.params.spotId);
  const userId = req.user.id;

  const existingSpot = await Spot.findOne({
    where: {
      id: spotId,
    },
  });
  if (!existingSpot) {
    const err = new Error();
    err.status = 404;
    err.message = "Spot couldn't be found";
    return next(err);
  }

  let bookings;
  if (existingSpot.ownerId === userId) {
    bookings = await Booking.findAll({
      where: {
        spotId: existingSpot.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
  } else {
    bookings = await Booking.findAll({
      where: {
        spotId: existingSpot.id,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });
  }

  return res.json({ Bookings: bookings });
});


router.post("/:spotId/bookings", requireAuth,async (req, res, next) => {
    const spotId = Number(req.params.spotId);
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const existingSpot = await Spot.findByPk(spotId);

    if (!existingSpot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (existingSpot.ownerId === userId) {
      const err = new Error("You cannot book your own spot");
      err.status = 403;
      return next(err);
    }

    const existingBookings = await Booking.findAll({
      where: {
        spotId: existingSpot.id,
      },
    });

    const newBooking = {
      spotId: existingSpot.id,
      userId,
      startDate,
      endDate,
    };

    for (const booking of existingBookings) {
      if (
        new Date(newBooking.startDate) >= new Date(booking.startDate) &&
        new Date(newBooking.startDate) <= new Date(booking.endDate)
      ) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          startDate: "Start date conflicts with an existing booking",
        };
        return next(err);
      }

      if (
        new Date(newBooking.endDate) >= new Date(booking.startDate) &&
        new Date(newBooking.endDate) <= new Date(booking.endDate)
      ) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          startDate: "Start date surrounds an existing booking",
          endDate: "End date conflicts with an existing booking",
        };
        return next(err);
      }

      if (
        new Date(newBooking.startDate) <= new Date(booking.startDate) &&
        new Date(newBooking.endDate) >= new Date(booking.endDate)
      ) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          startDate: "Start date surrounds an existing booking",
          endDate: "End date surrounds an existing booking",
        };
        return next(err);
      }
    }

    if (new Date(startDate) >= new Date(endDate)) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = {
        startDate: "Start date surrounds an existing booking",
        endDate: "End date cannot be on or before the start date",
      };
      return next(err);
    }

    const createdBooking = await Booking.create(newBooking);

    return res.json(createdBooking);
  }
);


module.exports = router;
