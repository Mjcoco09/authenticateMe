const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const {Booking, Spot,SpotImage,  Review, sequelize,ReviewImage, User} = require("../../db/models");


router.get("/current", requireAuth, async (req, res) => {
  const currentUserId = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId: currentUserId },
    include: [
      {
        model: Spot,
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
          "price",
        ],
        include: [
          {
            model: SpotImage,
            as:"SpotImages",
            attributes: ["url"],
            where: { preview: true },
            required: false,
          },
        ],
      },
    ],
  });

  const formattedBookings = bookings.map((booking) => ({
    id: booking.id,
    spotId: booking.Spot.id,
    Spot: {
      id: booking.Spot.id,
      ownerId: booking.Spot.ownerId,
      address: booking.Spot.address,
      city: booking.Spot.city,
      state: booking.Spot.state,
      country: booking.Spot.country,
      lat: parseFloat(booking.Spot.lat),
      lng: parseFloat(booking.Spot.lng),
      name: booking.Spot.name,
      price:parseFloat(booking.Spot.price),
      previewImage: booking.Spot.SpotImages[0]?.url || null,
    },
    userId: booking.userId,
    startDate: booking.startDate.toISOString().split("T")[0],
    endDate: booking.endDate.toISOString().split("T")[0],
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }));

  return res.json({ Bookings: formattedBookings });
});


router.put("/:bookingId", requireAuth,async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }

  const existingSpot = await Spot.findByPk(booking.spotId);

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

    if (new Date() > new Date(booking.endDate)) {
      const err = new Error("Past bookings can't be modified");
      err.status = 403;
      return next(err);
    }

  const newBooking = {
    spotId: existingSpot.id,
    userId,
    startDate,
    endDate,
  };

  for (const existingBooking of existingBookings) {
    if (
      existingBooking.id !== booking.id && // Exclude the current booking
      (
        (new Date(newBooking.startDate) >= new Date(existingBooking.startDate) &&
          new Date(newBooking.startDate) <= new Date(existingBooking.endDate)) ||
        (new Date(newBooking.endDate) >= new Date(existingBooking.startDate) &&
          new Date(newBooking.endDate) <= new Date(existingBooking.endDate)) ||
        (new Date(newBooking.startDate) <= new Date(existingBooking.startDate) &&
          new Date(newBooking.endDate) >= new Date(existingBooking.endDate))
      )
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      err.errors = {
        startDate: "Start date or end date conflicts with an existing booking",
        endDate: "Start date or end date conflicts with an existing booking",
      };
      return next(err);
    }
  }

  if (new Date(startDate) >= new Date(endDate)) {
    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = {
      "endDate": "endDate cannot come before startDate"
    };
    return next(err);
  }

  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  res.json({
    id: booking.id,
    spotId: booking.spotId,
    userId: booking.userId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    });
  }
);
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const userId = req.user.id;

  const booking = await Booking.findByPk(bookingId, {
    include: Spot,
  });
  if (!booking) {
    const err = new Error("Booking couldn't be found");
    err.status = 404;
    return next(err);
  }

  if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }






  if (new Date(booking.startDate) <= new Date()) {
    const err = new Error("Bookings that have been started can't be deleted");
    err.status = 403;
    return next(err);
  }

  await booking.destroy();

  res.json({
    message: "Successfully deleted",
  });
});









module.exports = router;
