const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Competition = require('./models/Competition');

const seedData = async () => {
  try {
    const mongod = await MongoMemoryServer.create({ instance: { dbName: 'feedants_db' } });
    const uri = mongod.getUri();
    console.log('InMemory MongoDB Started at:', uri);
    
    await mongoose.connect(uri);
    await Competition.deleteMany();

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
      registrationDeadline: new Date(Date.now() + 30 * 3600 * 1000),
      submissionStartDate: new Date('2026-08-06T04:00:00'),
      submissionEndDate: new Date('2026-08-30T23:55:00'),
      resultDate: new Date('2026-09-01T23:50:00'),
      aboutText: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent.',
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

    console.log('Database Seeded Successfully!');
    console.log('Sample Competition ID:', sample._id.toString());
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
