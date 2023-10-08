"use strict";

const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require("../models");
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
          isSeederData:true
        },
        {
          firstName: "Joey",
          lastName: "Smoey",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          isSeederData:true
        },
        {
          firstName: "Joerrr",
          lastName: "Smoerrr",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          isSeederData:true
        },
      ],
      { validate: true }
    );

    // Spot seeding code
    await Spot.bulkCreate(
      [
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
          isSeederData:true
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
          isSeederData:true
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
          isSeederData:true
        },
      ],

    );

    // Booking seeding code
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2022-11-01",
        endDate: "2022-11-30",
        isSeederData:true
      },
      {
        spotId: 2,
        userId: 2,
        isSeederData:true,
        startDate: "2022-04-01",
        endDate: "2022-05-30",
      },
      {
        spotId: 3,
        userId: 3,
        isSeederData:true,
        startDate: "2022-06-01",
        endDate: "2022-07-30",
      },
    ]),
    await Review.bulkCreate([
      {
        spotId:1,
        userId:1,
        isSeederData:true,
        review:"not bad not bad",
        stars:4,
      },
      {
        spotId:2,
        userId:2,
        isSeederData:true,
        review:"noice very noice",
        stars:5,
      },
      {
        spotId:3,
        userId:3,
        isSeederData:true,
        review:"meh it was okay",
        stars:1,
      }
    ]),
    await ReviewImage.bulkCreate([
      {
        reviewId:1,
        url:"https://ibb.co/GkqpfS3",
        isSeederData:true
      },
      {
        reviewId:2,
        url:"https://ibb.co/GkqpfS4",
        isSeederData:true
      },  {
        reviewId:3,
        url:"https://ibb.co/GkqpfS5",
        isSeederData:true
      }

    ]),
    await SpotImage.bulkCreate([
      {
        spotId:1,
        url:"https://ibb.co/GkqpfS6",
        preview:true,
        isSeederData:true
      },
      {
        spotId:2,
        url:"https://ibb.co/GkqpfS7",
        preview:true,
        isSeederData:true
      },
      {
        spotId:3,
        url:"https://ibb.co/GkqpfS8",
        preview:true,
        isSeederData:true
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    //User
    await queryInterface.bulkDelete("Users", {
     where:{isSeederData:true},
    });
    // Spot
    await queryInterface.bulkDelete("Spots", {
      where:{isSeederData:true},
    });

    // Booking
    await queryInterface.bulkDelete("Bookings", {
      where:{isSeederData:true},
    });
    //Review
    await queryInterface.bulkDelete("Review",{
      where:{isSeederData:true},
    }),
    await queryInterface.bulkDelete("ReviewImage",{
      where:{isSeederData:true},
    }),
    await queryInterface.bulkDelete("SpotImage",{
      where:{isSeederData:true},
    })
  },
};
