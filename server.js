// server.js

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const profileRouter = require('./routes/profile');
const settingsRouter = require('./routes/settings');
const helpRouter = require('./routes/help');
const mainRouter = require('./routes/main'); // Main screen route
const barcodeScannerRouter = require('./routes/barcodeScanner'); // Barcode Scanner route
const learningModulesRouter = require('./routes/learningModules'); // Learning Modules route
const challengesRouter = require('./routes/challenges'); // Challenges route
const rewardsRouter = require('./routes/rewards'); // Rewards route
const { app: firebaseApp, auth, db, googleProvider, facebookProvider } = require('./firebaseConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use sessions to track user login state
app.use(session({
  secret: 'transformers-web-app', // Replace with a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

// Middleware to add loggedInUser to all routes
app.use((req, res, next) => {
  res.locals.loggedInUser = req.session.user;
  next();
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
app.use('/auth', authRouter);
app.use('/dashboard', checkAuth, dashboardRouter);
app.use('/profile', checkAuth, profileRouter);
app.use('/settings', checkAuth, settingsRouter);
app.use('/help', checkAuth, helpRouter);
app.use('/', checkAuth, mainRouter); // Main screen route
app.use('/barcode-scanner', checkAuth, barcodeScannerRouter); // Barcode Scanner route
app.use('/learning-modules', checkAuth, learningModulesRouter); // Learning Modules route
app.use('/challenges', checkAuth, challengesRouter); // Challenges route
app.use('/rewards', checkAuth, rewardsRouter); // Rewards route

// Ensure main screen is rendered as the default route for authenticated users
app.get('/', (req, res) => {
  if (req.session.user) {
    res.render('main'); // Render the main screen
  } else {
    res.redirect('/auth/login');
  }
});

// Profile setup route
app.get('/profile/setup', checkAuth, (req, res) => {
  res.render('profileSetup');
});

app.post('/profile/setup', checkAuth, upload.single('profilePicture'), async (req, res) => {
  const { displayName, recyclingGoals } = req.body;
  try {
    const userRef = db.collection('users').doc(req.session.user.uid);
    const profilePicture = req.file ? `/images/uploads/${req.file.filename}` : '';
    const updateData = {
      displayName,
      recyclingGoals,
      profilePicture
    };

    await userRef.update(updateData);
    res.redirect('/');
  } catch (error) {
    console.error('Error during profile setup:', error);
    res.status(500).send('Error during profile setup');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Failed to destroy session during logout:', err);
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/auth/login');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

