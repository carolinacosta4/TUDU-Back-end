module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      title: { type: String, required: true },
      info: { type: String },
      IDcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'TipCategory' },
      image: { type: String },
      cloudinary_id: { type: Number },
      createdAt: { type: Date, default: Date.now }
  }, {
      collection: 'tip',
      timestamps: false
  });

  const Tip = mongoose.model('Tip', schema);
  return Tip;
};
