"use strict";

const {
  User,
  Spot,
  Booking,
  Review,
  ReviewImage,
  SpotImage,
} = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Joe",
          lastName: "Smoe",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Joey",
          lastName: "Smoey",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Joerrr",
          lastName: "Smoerrr",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
      ],
      { validate: true }
    );

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 fish st",
        city: "atlantis",
        state: "Timbucktoo",
        country: "france",
        lat: 12.45,
        lng: 11.1,
        name: "bikini bottom",
        description: "where spongebob lives",
        price: 250,
      },
      {
        ownerId: 2,
        address: "900 fish st",
        city: "chicago",
        state: "illinois",
        country: "USA",
        lat: 12.47,
        lng: 11.13,
        name: "OG Fish Spot",
        description: "only og fishes live here",
        price: 300,
      },
      {
        ownerId: 3,
        address: "shmaketown",
        city: "calabaskas",
        state: "florida",
        country: "USA",
        lat: 111.148,
        lng: 123.123,
        name: "evil shamake location",
        description: "you can live here if your name is shmake",
        price: 3,
      },
    ]);

    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2022-11-01",
        endDate: "2022-11-30",
      },
      {
        spotId: 2,
        userId: 2,

        startDate: "2022-04-01",
        endDate: "2022-05-30",
      },
      {
        spotId: 3,
        userId: 3,

        startDate: "2022-06-01",
        endDate: "2022-07-30",
      },
    ]),
      await Review.bulkCreate([
        {
          spotId: 1,
          userId: 1,

          review: "not bad not bad",
          stars: 4,
        },
        {
          spotId: 2,
          userId: 2,

          review: "noice very noice",
          stars: 5,
        },
        {
          spotId: 3,
          userId: 3,

          review: "meh it was okay",
          stars: 1,
        },
      ]),
      await ReviewImage.bulkCreate([
        {
          reviewId: 1,
          url: "https://ibb.co/GkqpfS3",
        },
        {
          reviewId: 2,
          url: "https://ibb.co/GkqpfS4",
        },
        {
          reviewId: 3,
          url: "https://ibb.co/GkqpfS5",
        },
      ]),
      await SpotImage.bulkCreate([
        {
          spotId: 1,
          url: "https://ibb.co/GkqpfS6",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://ibb.co/GkqpfS7",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://ibb.co/GkqpfS8",
          preview: true,
        },
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});

    await queryInterface.bulkDelete("Spots", null, {});

    await queryInterface.bulkDelete("Bookings", null, {});

    await queryInterface.bulkDelete("Reviews", null, {});

    await queryInterface.bulkDelete("ReviewImages", null, {});

    await queryInterface.bulkDelete("SpotImages", null, {});
  },
};
