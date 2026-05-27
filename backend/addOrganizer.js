const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const Organizer = require('./models/Organizer');

(async () => {
  try {
    await connectDB();

    const organizers = [
      { name: 'Organizer One', email: 'org1@campus.com', password: 'Organizer@123' },
      { name: 'Organizer Two', email: 'org2@campus.com', password: 'Organizer@123' }
    ];

    for (const o of organizers) {
      let exists = await Organizer.findOne({ email: o.email });
      if (exists) {
        console.log('Organizer exists:', o.email);
        continue;
      }
      const org = new Organizer(o);
      await org.save();
      console.log('Created organizer:', o.email, 'password:', o.password);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error creating organizers:', err);
    process.exit(1);
  }
})();
