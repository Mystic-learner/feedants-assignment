const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [{ type: String }],
  hasCertificate: { type: Boolean, default: true },
  prizePool: { type: Number, required: true },
  entryFee: { type: Number, required: true },
  totalSpots: { type: Number, required: true },
  bookedSpots: { type: Number, default: 0 },
  judge: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    experience: { type: String, required: true },
    imageUrl: { type: String },
    introVideoUrl: { type: String }
  },
  registrationDeadline: { type: Date, required: true },
  submissionStartDate: { type: Date, required: true },
  submissionEndDate: { type: Date, required: true },
  resultDate: { type: Date, required: true },
  aboutText: { type: String },
  judgingParametersText: { type: String },
  rulesEligibilityText: { type: String },
  rewards: [{
    positionTitle: String,
    amount: Number
  }],
  status: {
    type: String,
    enum: ['DRAFT', 'UPCOMING', 'REGISTRATION_OPEN', 'SUBMISSION_OPEN', 'EVALUATION', 'COMPLETED'],
    default: 'REGISTRATION_OPEN'
  }
}, { timestamps: true });

module.exports = mongoose.model('Competition', competitionSchema);
