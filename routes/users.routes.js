const express = require("express");
let router = express.Router();
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");

router.route("/").get(usersController.findAll).post(usersController.register);
router.route("/login").post(usersController.login);

router
  .route("/:idU")
  .get(usersController.findUser)
  .patch(authController.verifyToken, usersController.edit)
  .delete(authController.verifyToken, usersController.delete);

router.route("/:idU/achievements/:idA").post(authController.verifyToken, usersController.unlockAchievement)

router.all("*", function (req, res) {
  res.status(404).json({ message: "users: what???" });
});

module.exports = router;
