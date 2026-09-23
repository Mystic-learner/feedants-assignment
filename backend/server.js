const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Competition = require('./models/Competition');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/competitions', require('./routes/competitionRoutes'));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const mongod = await MongoMemoryServer.create({ instance: { dbName: 'feedants_db' } });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('InMemory MongoDB connected at:', uri);

    // Auto-seed default competition if empty
    const count = await Competition.countDocuments();
    if (count === 0) {
      const sample = await Competition.create({
        title: 'Feedants Classical Dance',
        tags: ['Dance', 'Multi-Win'],
        hasCertificate: true,
        prizePool: 1500,
        entryFee: 99,
        totalSpots: 20,
        bookedSpots: 1,
        judge: {
          name: 'Manju Dubey',
          title: 'Professional Kathak Dancer',
          experience: '12+ Years of Experience',
          imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
          introVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
        },
        registrationDeadline: new Date(Date.now() + 36 * 3600 * 1000 + 28 * 60 * 1000),
        submissionStartDate: new Date('2026-08-06T04:00:00'),
        submissionEndDate: new Date('2026-08-30T23:55:00'),
        resultDate: new Date('2026-09-01T23:50:00'),
        aboutText: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
        judgingParametersText: 'Choreography, Rhythm & Synchronization, Facial Expressions, Overall Presentation.',
        rulesEligibilityText: 'Submission video must be unedited. Length must be between 1 to 3 minutes. Open globally.',
        rewards: [
          { positionTitle: '1st Winner', amount: 550 },
          { positionTitle: '2nd Winner', amount: 300 },
          { positionTitle: '3rd Winner', amount: 240 },
          { positionTitle: '4th Winner', amount: 200 },
          { positionTitle: '5th Winner', amount: 130 },
          { positionTitle: '6th Winner', amount: 80 }
        ]
      });
      console.log('Auto-Seeded Sample Competition ID:', sample._id.toString());
    }

    app.listen(PORT, () => console.log('Server running on port ' + PORT));
  } catch (err) {
    console.error('Server startup error:', err);
  }
}

startServer();
