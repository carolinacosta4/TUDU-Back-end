module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      title: { type: String, required: true },
      info: { type: String, required: true },
      IDcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'TipCategory', required: true  },
      image: { type: String, required: true },
      cloudinary_id: { type: String },
      createdAt: { type: Date, default: Date.now }
  }, {
      collection: 'tip',
      timestamps: false
  });

  const Tip = mongoose.model('Tip', schema);
  return Tip;
};
