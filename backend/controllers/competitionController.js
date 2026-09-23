const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

exports.getLatestCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOne().sort({ createdAt: -1 });
    if (!competition) {
      return res.status(404).json({ success: false, message: 'No competition found' });
    }

    const userId = req.query.userId || 'demo_user_123';
    const registration = await Registration.findOne({ competitionId: competition._id, userId });

    return res.status(200).json({
      success: true,
      data: competition,
      userRegistrationStatus: {
        isRegistered: !!registration,
        hasSubmitted: !!registration?.submissionUrl
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    const userId = req.query.userId || 'demo_user_123';
    const registration = await Registration.findOne({ competitionId: competition._id, userId });

    return res.status(200).json({
      success: true,
      data: competition,
      userRegistrationStatus: {
        isRegistered: !!registration,
        hasSubmitted: !!registration?.submissionUrl
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.registerForCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || 'demo_user_123';

    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    if (competition.bookedSpots >= competition.totalSpots) {
      return res.status(400).json({ success: false, message: 'No spots remaining' });
    }

    const existing = await Registration.findOne({ competitionId: id, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered' });
    }

    const updated = await Competition.findOneAndUpdate(
      { _id: id, bookedSpots: { $lt: competition.totalSpots } },
      { $inc: { bookedSpots: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ success: false, message: 'Spot allocation failed, please try again' });
    }

    const registration = new Registration({
      competitionId: id,
      userId,
      paymentStatus: 'COMPLETED',
      paymentReference: 'PAY_' + Date.now()
    });

    await registration.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully registered',
      remainingSpots: updated.totalSpots - updated.bookedSpots
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
