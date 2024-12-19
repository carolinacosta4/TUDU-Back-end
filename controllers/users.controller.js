const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models/index.js");
const config = require("../config/db.config.js");
const mongoose = require("mongoose");
const User = db.User;

const handleErrorResponse = (res, error) => {
  return res
    .status(500)
    .json({ success: false, msg: error.message || "Some error occurred." });
};

exports.findAll = async (req, res) => {
  try {
    const users = await User.find().select("-password").exec();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.findUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idU))
      return res.status(400).json({
        success: false,
        msg: "Invalid ID.",
      });

    const user = await User.findById(req.params.idU)
      .populate("UserId", "-_id -email -password -__v")
      .select("-_id -__v -password")
      .exec();

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.register = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0)
      return res.status(400).json({
        success: false,
        msg: "You need to provide the body with the request.",
      });

    if (!req.body.name || !req.body.email || !req.body.password)
      return res.status(400).json({
        success: false,
        error: "Fields missing",
        msg: "You need to provide the name, email and password.",
      });

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      profilePicture: "https://example.com/profile.jpg",
      cloudinary_id: 0,
    });

    const newUser = await user.save();

    return res.status(201).json({
      success: true,
      msg: "Account created successfully.",
      data: newUser,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    if (Object.values(req.body).length == 0)
      return res.status(400).json({
        success: false,
        msg: "You need to provide the body with the request.",
      });

    if (!req.body.email || !req.body.password)
      return res.status(400).json({
        success: false,
        error: "Fields missing",
        msg: "You need to provide the email and password.",
      });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({
        success: false,
        error: "User not found",
        msg: "The user you tried loggin in doesn't exist.",
      });

    const check = bcrypt.compareSync(req.body.password, user.password);
    if (!check)
      return res.status(400).json({
        success: false,
        msg: "Wrong password.",
      });

    const token = jwt.sign({ id: user._id }, config.SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      msg: "User logged in successfully.",
      accessToken: token,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.edit = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idU))
      return res.status(400).json({
        success: false,
        msg: "Invalid ID.",
      });

    const user = await User.findById(req.params.idU);
    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });

    if (req.params.idU != req.loggedUserId) {
      return res.status(401).json({
        success: false,
        error: "Forbidden",
        msg: "You don't have permission to edit this user.",
      });
    }

    if (Object.values(req.body).length == 0)
      return res.status(400).json({
        success: false,
        msg: "You need to provide the body with the request.",
      });

    if (!req.body.name && !req.body.email && !req.body.password)
      return res.status(400).json({
        success: false,
        error: "Fields missing",
        msg: "You need to provide the name, email or password.",
      });

    await User.findByIdAndUpdate(req.params.idU, {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const updatedUser = await User.findById(req.params.idU);
    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.idU))
      return res.status(400).json({
        success: false,
        msg: "Invalid user ID.",
      });

    const user = await User.findById(req.params.idU);
    if (!user)
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });

    if (user._id != req.loggedUserId)
      return res.status(401).json({
        success: false,
        error: "Forbidden",
        msg: "You don't have permission to edit this user.",
      });

    await User.findByIdAndDelete(user.id);

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully.",
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
