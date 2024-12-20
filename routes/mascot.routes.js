const express = require("express");
let router = express.Router();
const mascotController = require("../controllers/mascot.controller");

router.route("/")
  .get(mascotController.findAll)
  .post(mascotController.addNewMascot);


router.all("*", function (req, res) {
  res.status(404).json({ message: "No route found" });
});

module.exports = router;