module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      image: { type: String},
      lockedImage: { type: String },
      cloudinary_id_image: { type: String, required: true  },
      cloudinary_id_lockedImage: { type: String, required: true  },
    },
    {
      collection: "achievements",
      timestamps: false,
    }
  );

  const Achievement = mongoose.model("Achievement", schema);
  return Achievement;
};
