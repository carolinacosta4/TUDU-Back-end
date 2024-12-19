module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      IDAchievements: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
      IDuser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      unlockedAt: { type: Date, default: Date.now }
  }, {
      collection: 'userachievements',
      timestamps: false
  });

  const UserAchievement = mongoose.model('UserAchievement', schema);
  return UserAchievement;
};
