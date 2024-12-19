module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      IDuser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, required: true }
  }, {
      collection: 'streaks',
      timestamps: false
  });

  const Streak = mongoose.model('Streak', schema);
  return Streak;
};
