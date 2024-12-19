module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      name: { type: String, required: true },
      priority: { type: String, enum: ['low', 'medium', 'high'] },
      IDcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryTask' },
      startDate: { type: Date },
      endDate: { type: Date },
      periodicity: { type: String, enum: ['daily', 'weekly', 'monthly'] },
      notification: { type: Boolean, default: true },
      notes: { type: String },
      status: { type: Boolean, default: false },
      IDuser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, {
      collection: 'task',
      timestamps: false
  });

  const Task = mongoose.model('Task', schema);
  return Task;
};
