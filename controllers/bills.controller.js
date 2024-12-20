const db = require("../models/index.js");
const mongoose = require("mongoose");
const Bill = db.Bill;

const handleErrorResponse = (res, error) => {
  return res
    .status(500)
    .json({ success: false, msg: error.message || "Some error occurred." });
};

exports.create = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0)
      return res.status(400).json({
        success: false,
        msg: "You need to provide the body with the request.",
      });

    // if (
    //   !req.body.name ||
    //   !req.body.priority ||
    //   !req.body.IDcategory ||
    //   !req.body.startDate ||
    //   !req.body.endDate ||
    //   !req.body.periodicity ||
    //   !req.body.notification
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "Fields missing",
    //     msg: "You need to provide the name, priority, category, startDate, endDate, periodicity and notification.",
    //   });
    // }
    let bill = new Bill({
      name: req.body.name,
      priority: req.body.priority,
      amount: req.body.amount,
      dueDate: req.body.dueDate,
      periodicity: req.body.periodicity,
      notification: req.body.notification,
      notes: req.body.notes || "",
      status: false,
      IDuser: req.loggedUserId,
    });

    const newBill = await bill.save();

    return res.status(201).json({
      success: true,
      msg: "Bill created successfully.",
      data: newBill,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.findBill = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idB))
      return res.status(400).json({
        success: false,
        msg: "Invalid ID.",
      });

    const bill = await Bill.findById(req.params.idB)
      .populate(
        "IDuser",
        "-password -__v -profilePicture -cloudinary_id -notifications -sound -vibration -darkMode -isDeactivated"
      )
      .select("-_id -__v")
      .exec();

    return res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.edit = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idB))
      return res.status(400).json({
        success: false,
        msg: "Invalid ID.",
      });

    const bill = await Bill.findById(req.params.idB);
    if (!bill)
      return res.status(404).json({
        success: false,
        msg: "Bill not found.",
      });

    if (bill.IDuser != req.loggedUserId) {
      return res.status(401).json({
        success: false,
        error: "Forbidden",
        msg: "You don't have permission to edit this bill.",
      });
    }

    if (Object.values(req.body).length == 0)
      return res.status(400).json({
        success: false,
        msg: "You need to provide the body with the request.",
      });

    if (!req.body.periodicity && !req.body.dueDate)
      return res.status(400).json({
        success: false,
        error: "Fields missing",
        msg: "You need to provide the periodicity or due date.",
      });

    await Bill.findByIdAndUpdate(req.params.idB, {
      periodicity: req.body.periodicity || bill.periodicity,
      dueDate: req.body.dueDate || bill.dueDate,
    });

    const updatedTask = await Bill.findById(req.params.idB);
    return res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idB))
      return res.status(400).json({
        success: false,
        msg: "Invalid bill ID.",
      });

    const bill = await Bill.findById(req.params.idB);
    if (!bill)
      return res.status(404).json({
        success: false,
        msg: "Bill not found.",
      });

    if (bill.IDuser != req.loggedUserId)
      return res.status(401).json({
        success: false,
        error: "Forbidden",
        msg: "You don't have permission to delete this bill.",
      });

    await Bill.findByIdAndDelete(bill._id);

    return res.status(200).json({
      success: true,
      msg: "Bill deleted successfully.",
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
