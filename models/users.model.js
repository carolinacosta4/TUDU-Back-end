module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      profilePicture: { type: String },
      cloudinary_id: { type: Number },
      notifications: { type: Boolean, default: true },
      sound: { type: Boolean, default: true, required: true },
      vibration: { type: Boolean, default: true, required: true },
      darkMode: { type: Boolean, default: false, required: true },
      isDeactivated: { type: Boolean, default: false, required: true },
      onboardingSeen: { type: Boolean, default: false, required: true },
      IDmascot: { type: mongoose.Schema.Types.ObjectId, ref: "Mascot" },
    },
    {
      collection: "user",
      timestamps: false,
    }
  );

  const User = mongoose.model("User", schema);
  return User;
};
