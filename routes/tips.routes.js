const express = require("express");
let router = express.Router();
const tipsController = require("../controllers/tips.controller");
const authController = require("../controllers/auth.controller");

router
  .route("/")
  .post(tipsController.addTip)
  .get(tipsController.findAll)


router.route("/:idT")
  .delete(tipsController.deleteTip)
  .get(tipsController.findOne)

  router.route("/:idT/favorite")
    .post(authController.verifyToken, tipsController.markAsFavorite)
    .delete(authController.verifyToken, tipsController.removeFromFavorite)


router.all("*", function (req, res) {
  res.status(404).json({ message: "No route found" });
});

module.exports = router;