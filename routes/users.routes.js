const express = require("express");
let router = express.Router();
const usersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");

router.route("/").get(usersController.findAll).post(usersController.register);
router.route("/login").post(usersController.login);
router.route("/reset-password/:idU").post(usersController.resetPassword);
router.route("/password-recovery").post(usersController.recoverEmail);
router
  .route("/:idU")
  .get(usersController.findUser)
  .patch(authController.verifyToken, usersController.edit)
  .delete(authController.verifyToken, usersController.delete);
router
  .route("/:idU/onboarding")
  .patch(authController.verifyToken, usersController.editOnboarding);

router.all("*", function (req, res) {
  res.status(404).json({ message: "users: what???" });
});

module.exports = router;
