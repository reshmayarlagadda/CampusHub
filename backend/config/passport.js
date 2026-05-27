const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Student = require('../models/Student');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let student = await Student.findOne({ googleId: profile.id });

        if (student) {
          return done(null, student);
        }

        // Create new student if email exists
        student = await Student.findOne({ email: profile.emails[0].value });

        if (student) {
          // Link Google account to existing student
          student.googleId = profile.id;
          student.provider = 'google';
          if (!student.profileImage && profile.photos[0]) {
            student.profileImage = profile.photos[0].value;
          }
          await student.save();
          return done(null, student);
        }

        // Create new student with Google info
        const newStudent = new Student({
          googleId: profile.id,
          provider: 'google',
          name: profile.displayName,
          email: profile.emails[0].value,
          profileImage: profile.photos[0]?.value,
          isVerified: true,
          hasRegistered: true,
        });

        await newStudent.save();
        return done(null, newStudent);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Student.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
