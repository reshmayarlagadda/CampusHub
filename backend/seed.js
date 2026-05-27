const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Organizer = require('./models/Organizer');

(async () => {
  try {
    await connectDB();

    // Admin seed
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@campus.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.SEED_ADMIN_NAME || 'Administrator';

    let admin = await Admin.findOne({ email: adminEmail }).select('+password');
    if (admin) {
      console.log('Admin already exists:', adminEmail);
    } else {
      admin = new Admin({ name: adminName, email: adminEmail, password: adminPassword });
      await admin.save();
      console.log('Created admin:', adminEmail, 'password:', adminPassword);
    }

    // Student seed
    const studentEmail = process.env.SEED_STUDENT_EMAIL || 'student1@campus.com';
    const studentRegNo = process.env.SEED_STUDENT_REGNO || 'S1001';
    const studentPassword = process.env.SEED_STUDENT_PASSWORD || 'Student@123';

    let student = await Student.findOne({ email: studentEmail }).select('+password');
    if (student) {
      const updates = {};
      if (!student.isVerified) updates.isVerified = true;
      if (!student.hasRegistered) updates.hasRegistered = true;
      if (Object.keys(updates).length > 0) {
        await Student.findByIdAndUpdate(student._id, updates);
        console.log('Updated student registration status:', studentEmail);
      } else {
        console.log('Student already exists:', studentEmail);
      }
    } else {
      student = new Student({
        regNo: studentRegNo,
        name: 'Test Student',
        email: studentEmail,
        phone: '9999999999',
        branch: 'CSE',
        year: '3',
        password: studentPassword,
        isVerified: true,
        hasRegistered: true
      });
      await student.save();
      console.log('Created student:', studentEmail, 'password:', studentPassword, 'regNo:', studentRegNo);
    }

    // Organizer seed
    const organizerEmail = process.env.SEED_ORGANIZER_EMAIL || 'organizer1@campus.com';
    const organizerPassword = process.env.SEED_ORGANIZER_PASSWORD || 'Organizer@123';
    const organizerName = process.env.SEED_ORGANIZER_NAME || 'Organizer One';

    let organizer = await Organizer.findOne({ email: organizerEmail }).select('+password');
    if (organizer) {
      console.log('Organizer already exists:', organizerEmail);
    } else {
      organizer = new Organizer({
        name: organizerName,
        email: organizerEmail,
        password: organizerPassword,
        isActive: true
      });
      await organizer.save();
      console.log('Created organizer:', organizerEmail, 'password:', organizerPassword);
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
})();
