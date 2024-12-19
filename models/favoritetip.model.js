module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      IDuser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      IDtip: { type: mongoose.Schema.Types.ObjectId, ref: 'Tip' }
  }, {
      collection: 'favoritetip',
      timestamps: false
  });

  const FavoriteTip = mongoose.model('FavoriteTip', schema);
  return FavoriteTip;
};
