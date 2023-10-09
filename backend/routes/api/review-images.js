const express = require("express");
const router = express.Router();
const { Review,ReviewImage} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");


router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;

    const reviewImage = await ReviewImage.findByPk(imageId, {
      include: Review,
    });

    if (!reviewImage) {
      const err = new Error("Review Image couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (reviewImage.Review.userId !== userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }


    await reviewImage.destroy();


    res.json({
      message: "Successfully deleted",
    });
  });
  module.exports = router;
