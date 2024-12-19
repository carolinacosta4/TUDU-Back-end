module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      name: { type: String, required: true }
  }, {
      collection: 'categorytask',
      timestamps: false
  });

  const CategoryTask = mongoose.model('CategoryTask', schema);
  return CategoryTask;
};
