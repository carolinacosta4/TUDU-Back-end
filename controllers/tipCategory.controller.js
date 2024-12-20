// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const db = require("../models/index.js");
const config = require("../config/db.config.js");
const mongoose = require("mongoose");
const TipCategory = db.TipCategory

const handleErrorResponse = (res, error) => {
    return res
        .status(500)
        .json({ success: false, msg: error.message || "Some error occurred." });
};

exports.findAll  = async (req, res) => {
    try {
        const categories = await TipCategory.find().exec();
    
        return res.status(200).json({
          success: true,
          data: categories,
        });
      } catch (error) {
        handleErrorResponse(res, error);
      }
}

exports.addNewTipCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ success: false, msg: "A name is required" });
        }

        const existingCategory = await TipCategory.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                msg: "A category with this name already exists."
            });
        }

        let tc = new TipCategory({
            name: req.body.name
        });

        const newTipCategory = await tc.save();

        return res.status(201).json({
            success: true,
            msg: "New category added successfully.",
            data: newTipCategory,
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