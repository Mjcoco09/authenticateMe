const express = require("express");
const router = express.Router();
const {
  Spot,
  SpotImage,
  Review,
  sequelize,
  User,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

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

router.get("/current", requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
  const filter = {
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
          [
            sequelize.literal(
              `(SELECT "url" FROM "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`
            ),
            "previewImage",
          ],
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  };
  const reviews = await Review.findAll(filter);
  return res.json({ Reviews:reviews });
});

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const reviewId = Number(req.params.reviewId);
  const userId = req.user.id;
  const { url } = req.body;
  const review = await Review.findOne({
    where: {
      id: reviewId,
      userId: userId,
    },
  });

  if (!review) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }

  const imageCount = await ReviewImage.count({
    where: {
      reviewId: review.id,
    },
  });

  if (imageCount >= 10) {
    const err = new Error(
      "Maximum number of images for this resource was reached"
    );
    err.status = 403;
    return next(err);
  }

  const reviewImage = await ReviewImage.create({
    reviewId: review.id,
    userId: userId,
    url: url,
  });

  return res.json({
    id: reviewImage.id,
    url: reviewImage.url,
  });
});

router.put("/:reviewId", [requireAuth, validReview], async (req, res, next) => {
  const { review, stars } = req.body;
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  const existingReview = await Review.findOne({
    where: {
      id: reviewId,
      userId: userId,
    },
  });

  if (!existingReview) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next(err);
  }
  existingReview.review = review;
  existingReview.stars = stars;

  await existingReview.save();

  return res.json(existingReview);
});
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const reviewId = Number(req.params.reviewId);
  const userId = req.user.id;
  const existingReview = await Review.findOne({
    where: {
      id: reviewId,
      userId: userId,
    },
  });

  if (!existingReview) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    return next (err)
  }

  await ReviewImage.destroy({
    where: {
      reviewId: existingReview.id,
    },
  });

  await existingReview.destroy();

  return res.json({ message: "Successfully deleted" });
});

module.exports = router;
