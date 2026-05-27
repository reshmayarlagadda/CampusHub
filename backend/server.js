const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

// Load environment variables FIRST
dotenv.config();
console.log(process.env.MONGO_URI);

const passport = require('./config/passport');
const { initializeEmailService } = require('./utils/emailService');
const app = express();

// Middleware - CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://campus-1-pink.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use(['/api/organizers', '/api/organizer'], require('./routes/organizerRoutes'));
app.use(['/api/admin', '/api/admins'], require('./routes/adminRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'CampusConnect API is running', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

// Connect DB & Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Initialize email service (non-blocking - server continues even if email fails)
    console.log('\n📧 Initializing Email Service...');
    const emailStatus = await initializeEmailService();
    if (!emailStatus.success) {
      console.log('\n⚠️ WARNING: Email service is not properly configured.');
      console.log('   Password reset functionality will NOT work until fixed.');
      console.log('   See GMAIL_APP_PASSWORD_SETUP.md for instructions.\n');
    } else {
      console.log();
    }
    
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
