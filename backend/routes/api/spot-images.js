const express = require("express");
const router = express.Router();
const { SpotImage,Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;

    const spotImage = await SpotImage.findByPk(imageId, {
      include: Spot,
    });


    if (!spotImage) {
      const err = new Error("Spot Image couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (spotImage.Spot.ownerId !== userId) {
      const err = new Error("forbidden");
      err.status = 403;
      return next(err);
    }



    await spotImage.destroy();

    res.json({
      message: "Successfully deleted",
    });
  });

























module.exports = router;
