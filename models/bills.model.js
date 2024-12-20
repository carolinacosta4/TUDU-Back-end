module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
      name: { type: String, required: true },
      priority: { type: String, enum: ['low', 'medium', 'high'] },
      amount: { type: Number, required: true },
      dueDate: { type: Date },
      notification: { type: Boolean, default: true },
      notes: { type: String },
      status: { type: Boolean, default: false },
      periodicity: { type: String, enum: ['once', 'weekly','monthly', 'yearly'] },
      IDuser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, {
      collection: 'bill',
      timestamps: false
  });

  const Bill = mongoose.model('Bill', schema);
  return Bill;
};
