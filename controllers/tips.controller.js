// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const db = require("../models/index.js");
const config = require("../config/db.config.js");
const mongoose = require("mongoose");
const Tip = db.Tip;
const TipCategory = db.TipCategory
const FavoriteTip = db.FavoriteTip


const handleErrorResponse = (res, error) => {
    return res
        .status(500)
        .json({ success: false, msg: error.message || "Some error occurred." });
};

const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: config.C_CLOUD_NAME,
    api_key: config.C_API_KEY,
    api_secret: config.C_API_SECRET
});

exports.findAll = async (req, res) => {
    try {
        const tips = await Tip.find().exec();

        if (!tips) {
            return res.status(200).json({
                success: false,
                msg: "No tips found",
            });
        }

        return res.status(200).json({
            success: true,
            data: tips,
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
}

exports.findOne = async (req, res) => {
    let idT = req.params.idT
    try {
        const tip = await Tip.findOne({ _id: idT }).exec();

        if (!tip) {
            return res.status(404).json({
                success: false,
                msg: "Tip not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: tip,
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
}

exports.addTip = async (req, res) => {
    try {
        if (!req.body.title || !req.body.info || !req.body.IDcategory || !req.body.image) {
            return res.status(400).json({
                success: false,
                msg: "Missing some required information"
            });
        }

        let existingCategory = await TipCategory.findOne({ _id: req.body.IDcategory });
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                msg: "Category not found"
            });
        }

        const createdAt = new Date();

        const uploadResult = await cloudinary.uploader.upload(req.body.image);

        if (!uploadResult) {
            return res.status(400).json({
                success: false,
                msg: "Could not upload imagem"
            });
        }

        let newTip = await Tip.create({
            title: req.body.title,
            info: req.body.info,
            IDcategory: req.body.IDcategory,
            image: uploadResult.secure_url,
            cloudinary_id: uploadResult.public_id,
            created_at: createdAt
        });

        return res.status(201).json({
            success: true,
            msg: "Tip created successfully.",
            data: newTip
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }

}

exports.deleteTip = async (req, res) => {
    let idT = req.params.idT
    try {
        const existingTip = await Tip.findOne({ _id: idT });
        if (existingTip) {
            await Tip.deleteOne(existingTip);
            return res.status(200).json({
                success: true,
                msg: 'Tip deleted successfully.'
            });
        }
        else {
            return res.status(404).json({
                success: false,
                error: "Tip  fot found",
                msg: "The specified Tip does not exist."
            });
        }
    } catch (error) {
        handleErrorResponse(res, error);
    }
}

exports.markAsFavorite = async (req, res) => {
    try {
        const idT = req.params.idT

        const tip = await Tip.findOne({ _id: idT }).exec();

        if (!tip) {
            return res.status(404).json({
                success: false,
                msg: "Tip not found",
            });
        }

        let favorite = new FavoriteTip({
            IDuser: req.loggedUserId,
            IDtip: idT
        });

        const fav = await FavoriteTip.findOne({
            IDuser: req.loggedUserId,
            IDtip: idT
        }).exec();

        if (fav) {
            return res.status(400).json({
                success: false,
                msg: "Tip already favorited",
            });
        }

        const newFavorite = await favorite.save();

        return res.status(201).json({
            success: true,
            msg: "Tip added to favorites",
            data: newFavorite,
        });
    } catch (error) {
        handleErrorResponse(res, error);
    }
}

exports.removeFromFavorite = async (req, res) => {
    let idT = req.params.idT

    try {
        const existingTip = await Tip.findOne({ _id: idT });
        if (!existingTip) {
            return res.status(404).json({
                success: false,
                error: "Tip  fot found",
                msg: "The specified Tip does not exist."
            }); 
        }
        else if (!(await FavoriteTip.findOne({IDuser: req.loggedUserId, IDtip: idT}))) {
            return res.status(404).json({
                success: false,
                error: "Tip not favorited",
                msg: "The specified Tip was not favorited."
            });
        }
        else {
            await FavoriteTip.deleteOne(await FavoriteTip.findOne({IDuser: req.loggedUserId, IDtip: idT}));
            return res.status(200).json({
                success: true,
                msg: 'Tip removed from favorites list.'
            });
        }
    } catch (error) {
        handleErrorResponse(res, error);
    }
}