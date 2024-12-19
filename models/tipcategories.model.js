module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      name: { type: String, required: true }
  }, {
      collection: 'tipcategory',
      timestamps: false
  });

  const TipCategory = mongoose.model('TipCategory', schema);
  return TipCategory;
};
