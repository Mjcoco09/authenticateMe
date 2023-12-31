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

  if (
    page < 0 ||
    size < 0 ||
    minLat < -180 || minLat > 180 ||
    maxLat < -180 || maxLat > 180 ||
    minLng < -180 || minLng > 180 ||
    maxLng < -180 || maxLng > 180 ||
    minPrice < 0 ||
    maxPrice < 0
  ) {
    const errors = {};

    if (page <= 1) {
      errors.page = "Page must be greater than or equal to 1";
    }

    if (size <= 1) {
      errors.size = "Size must be greater than or equal to 1";
    }

    if (minLat < -180 || minLat > 180) {
      errors.minLat = "Minimum latitude is invalid";
    }

    if (maxLat < -180 || maxLat > 180) {
      errors.maxLat = "Maximum latitude is invalid";
    }

    if (minLng < -180 || minLng > 180) {
      errors.minLng = "Minimum longitude is invalid";
    }

    if (maxLng < -180 || maxLng > 180) {
      errors.maxLng = "Maximum longitude is invalid";
    }

    if (minPrice < 0) {
      errors.minPrice = "Minimum price must be greater than or equal to 0";
    }

    if (maxPrice < 0) {
      errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

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
    include: [
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
      {
        model: Review,
        attributes: [],
      },
    ],
  });

  for (const spot of spots.rows) {
    const avgRatingResult = await Review.findOne({
      where: { spotId: spot.id },
      attributes: [[sequelize.fn("avg", sequelize.col("stars")), "avgRating"]],
      raw: true,
    });

    spot.dataValues.avgRating = avgRatingResult
      ? parseFloat(avgRatingResult.avgRating).toFixed(1)
      : null;

    spot.dataValues.previewImage = spot.SpotImages[0]?.url || null;
  }

  const spotsData = spots.rows.map((spot) => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    name: spot.name,
    description: spot.description,
    price: parseFloat(spot.price),
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.dataValues.avgRating || null,
    previewImage: spot.dataValues.previewImage,
  }));

  res.json({
    Spots: spotsData,
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
    .custom((value) => {
      if (value < -180 || value > 180) {
        throw new Error("Latitude is not valid");
      }
      return true;
    })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat()
    .custom((value) => {
      if (value < -180 || value > 180) {
        throw new Error("Longitude is not valid");
      }
      return true;
    })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .isFloat()
    .exists({ checkFalsy: true })
    .custom((value) => {
      if (value < 1) {
        throw new Error("Price per day is required");
      }
      return true;
    })
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
    ],
    include: [
      {
        model: SpotImage,
        as: "images",
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
      {
        model: Review,
        attributes: [],
      },
    ],
  };

  const spots = await Spot.findAll(filter);
  for (const spot of spots) {
    const avgRatingResult = await Review.findOne({
      where: { spotId: spot.id },
      attributes: [[sequelize.fn("avg", sequelize.col("stars")), "avgRating"]],
      raw: true,
    });

    spot.dataValues.avgRating = avgRatingResult
      ? parseFloat(avgRatingResult.avgRating).toFixed(1)
      : null;
  }

  const spotsData = spots.map((spot) => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    name: spot.name,
    description: spot.description,
    price: parseFloat(spot.price),
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.dataValues.avgRating || null,
    previewImage: spot.images[0]?.url || null,
  }));

  return res.json({ Spots: spotsData });
});
router.get("/:spotId", async (req, res, next) => {
  const thisSpotId = Number(req.params.spotId);

  const filter = {
    where: {
      id: thisSpotId,
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
    ],
    include: [
      {
        model: SpotImage,
        as: "SpotImages",
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
  spot.lat = Number(spot.lat);
  spot.lng = Number(spot.lng);
  spot.price = Number(spot.price);


  const numReviewsResult = await Review.count({
    where: { spotId: spot.id },
  });

  const avgRatingResult = await Review.findOne({
    where: { spotId: spot.id },
    attributes: [
      [sequelize.fn("avg", sequelize.col("stars")), "avgStarRating"],
    ],
    raw: true,
  });

  spot.dataValues.numReviews = numReviewsResult;
  spot.dataValues.avgStarRating = avgRatingResult
    ? parseFloat(avgRatingResult.avgStarRating).toFixed(1)
    : null;

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
  spot.lat = Number(spot.lat);
  spot.lng = Number(spot.lng);
  spot.price = Number(spot.price);
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
    const err = new Error();
    err.message = "Forbidden";
    err.status = 403;
    return next(err);
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
    const err = new Error();
    err.message = "Forbidden";
    err.status = 403;
    return next(err);
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
    const err = new Error();
    err.message = "Forbidden";
    err.status = 403;
    return next(err);
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

router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
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
    const err = new Error("Forbidden");
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
        endDate: "End date conflicts with an existing booking"
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
        startDate: "Start date conflicts with an existing booking",
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
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date surrounds an existing booking",
      };
      return next(err);
    }
  }

  if (new Date(startDate) >= new Date(endDate)) {
    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = {
      endDate: "End date cannot be on or before the start date",
    };
    return next(err);
  }

  const createdBooking = await Booking.create(newBooking);

  return res.json(createdBooking);
});

module.exports = router;
