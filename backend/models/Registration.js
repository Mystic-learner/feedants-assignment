const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: String, required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'COMPLETED' },
  paymentReference: { type: String },
  submissionUrl: { type: String, default: null },
  submittedAt: { type: Date, default: null }
}, { timestamps: true });

registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
