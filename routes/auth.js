const express = require('express');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { auth, db } = require('../firebaseConfig');
const { addDoc, collection } = require('firebase/firestore');
const router = express.Router();
require('dotenv').config();

router.get('/login', (req, res) => {
  res.render('login', { email: req.query.email || '' });
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('Attempting to create user with email:', email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created:', userCredential.user);

    // Add user to Firestore
    const userDoc = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      createdAt: new Date()
    };
    await addDoc(collection(db, 'users'), userDoc);
    console.log('User document added to Firestore:', userDoc);

    // Store session data and redirect to dashboard
    req.session.user = userCredential.user;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during sign up:', error);

    let errorMessage = 'An error occurred during sign up. Please try again.';
    if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'The email address is already in use.';
    }

    res.status(400).send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '${errorMessage}',
            footer: '<a href="/auth/signup">Try again</a>'
          }).then(() => {
            window.location.href = "/auth/signup";
          });
        });
      </script>
    `);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Attempting to log in user with email:', email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
    req.session.user = userCredential.user;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during login:', error);
    let errorMessage = 'An error occurred during login. Please try again.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No user found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid credentials provided.';
    }

    res.status(400).send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '${errorMessage}',
            footer: '<a href="/auth/login">Try again</a>'
          }).then(() => {
            window.location.href = "/auth/login";
          });
        });
      </script>
    `);
  }
});

// Handle Google Login
router.post('/google', async (req, res) => {
  const { user } = req.body;
  try {
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date()
    };
    await addDoc(collection(db, 'users'), userDoc);
    console.log('User document added to Firestore:', userDoc);

    req.session.user = user;
    res.status(200).send('User logged in with Google');
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(400).send('Failed to log in with Google');
  }
});

// Handle Facebook Login
router.post('/facebook', async (req, res) => {
  const { user } = req.body;
  try {
    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date()
    };
    await addDoc(collection(db, 'users'), userDoc);
    console.log('User document added to Firestore:', userDoc);

    req.session.user = user;
    res.status(200).send('User logged in with Facebook');
  } catch (error) {
    console.error('Error during Facebook login:', error);
    res.status(400).send('Failed to log in with Facebook');
  }
});

// Define the logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
