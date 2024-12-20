const express = require("express");
let router = express.Router();
const billsController = require("../controllers/bills.controller");
const authController = require("../controllers/auth.controller");

router.route("/").post(authController.verifyToken, billsController.create);
router
  .route("/:idB")
  .get(billsController.findBill)
  .patch(authController.verifyToken, billsController.edit)
  .delete(authController.verifyToken, billsController.delete);

router.all("*", function (req, res) {
  res.status(404).json({ message: "users: what???" });
});

module.exports = router;
