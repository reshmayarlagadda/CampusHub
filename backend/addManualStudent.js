const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const Student = require('./models/Student');

(async () => {
  try {
    await connectDB();

    const regNo = '4343';
    const email = '231fa04343@gmail.com';

    let student = await Student.findOne({ email });
    if (student) {
      console.log('Student already exists:', email);
      process.exit(0);
    }

    student = new Student({
      regNo,
      name: 'Manual Student',
      email,
      phone: '',
      branch: '',
      year: '',
      // no password set — student should create it via the app
      isVerified: false,
      hasRegistered: false
    });

    await student.save();
    console.log('Inserted student:', email, 'regNo:', regNo);
    process.exit(0);
  } catch (err) {
    console.error('Error inserting student:', err);
    process.exit(1);
  }
})();
