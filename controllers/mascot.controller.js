// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const db = require("../models/index.js");
const config = require("../config/db.config.js");
const mongoose = require("mongoose");
const Mascot = db.Mascot

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: config.C_CLOUD_NAME,
    api_key: config.C_API_KEY,
    api_secret: config.C_API_SECRET
});

const handleErrorResponse = (res, error) => {
    return res
        .status(500)
        .json({ success: false, msg: error.message || "Some error occurred." });
};

exports.findAll  = async (req, res) => {
    try {
        const mascots = await Mascot.find().exec();
    
        return res.status(200).json({
          success: true,
          data: mascots,
        });
      } catch (error) {
        handleErrorResponse(res, error);
      }
}

exports.addNewMascot = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ success: false, msg: "A name is required" });
        }
        if (!req.body.cloudnary_id) {
            return res.status(400).json({ success: false, msg: "The cloudnary_id is required" });
        }

        const existingMascot = await Mascot.findOne({ name: req.body.name });
        if (existingMascot) {
            return res.status(400).json({
                success: false,
                msg: "A mascot with this name already exists."
            });
        }

        let image;
        try {
            image = await cloudinary.api.resource(req.body.cloudinary_id);
        } catch (error) {
            return res.status(404).json({
                success: false,
                msg: "Could not find image in Cloudinary",
                error: error.message
            });
        }

        let mascot = new Mascot({
            name: req.body.name,
            description: req.body.description,
            image: image.secure_url,
            cloudinary_id: req.body.cloudinary_id
        });

        const newMascot = await mascot.save();

        return res.status(201).json({
            success: true,
            msg: "New mascot added successfully.",
            data: newMascot,
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }

}

exports.deleteTipCategory = async (req, res) => {
    let nameTC = req.params.nameTC
    try {
        const existingCategory = await TipCategory.findOne({ name: nameTC });
        if (existingCategory) {
            await TipCategory.deleteOne({ name: nameTC });
                return res.status(200).json({
                    success: true,
                    msg: 'Category deleted successfully.'
                });
        }
        else {
            return res.status(404).json({
                success: false,
                error: "Tip Category fot found",
                msg: "The specified Tip Category does not exist."
            });
        }
    } catch (error) {
        handleErrorResponse(res, error);
    }
}