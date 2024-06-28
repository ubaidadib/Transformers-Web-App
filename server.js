const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const { app: firebaseApp, auth, db } = require('./firebaseConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve JS files from the "js" directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use sessions to track user login state
app.use(session({
  secret: 'transformers-web-app', // Replace with a secure random string
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

app.use('/auth', authRouter);
app.use('/dashboard', checkAuth, dashboardRouter);
app.use('/', checkAuth, indexRouter);

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard'); // Redirect to the dashboard or home page
  } else {
    res.redirect('/auth/login');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
