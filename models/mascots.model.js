module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      cloudinary_id: { type: Number }
  }, {
      collection: 'mascot',
      timestamps: false
  });

  const Mascot = mongoose.model('Mascot', schema);
  return Mascot;
};
