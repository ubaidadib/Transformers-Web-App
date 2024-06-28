const express = require('express');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { auth, db } = require('../firebaseConfig');
const { setDoc, doc } = require('firebase/firestore');
const axios = require('axios');
const router = express.Router();
const admin = require('firebase-admin');

// Verify reCAPTCHA function
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: token
      }
    });
    console.log('reCAPTCHA response:', response.data); // Log the response for debugging
    return response.data.success;
  } catch (error) {
    console.error('Error during reCAPTCHA verification:', error);
    return false;
  }
}

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { email, password, 'g-recaptcha-response': recaptchaToken } = req.body;
  console.log('Received reCAPTCHA token:', recaptchaToken); // Log the token for debugging
  try {
    if (await verifyRecaptcha(recaptchaToken)) {
      console.log('Attempting to create user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);

      // Add user to Firestore with UID as the document ID
      const userDoc = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: new Date()
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

      req.session.user = userCredential.user;

      // Send success message to the client and redirect to dashboard
      res.status(200).send(`
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <script>
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your information has been saved. Redirecting to dashboard...',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.href = '/dashboard';
          });
        </script>
      `);
    } else {
      throw new Error('Failed reCAPTCHA verification');
    }
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(400).send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '${error.message}',
          footer: '<a href="/auth/signup">Try again</a>'
        }).then(() => {
          window.location.href = "/auth/signup";
        });
      </script>
    `);
  }
});

router.post('/login', async (req, res) => {
  const { email, password, 'g-recaptcha-response': recaptchaToken } = req.body;
  try {
    if (await verifyRecaptcha(recaptchaToken)) {
      console.log('Attempting to log in user with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      req.session.user = userCredential.user;
      res.redirect('/dashboard');
    } else {
      throw new Error('Failed reCAPTCHA verification');
    }
  } catch (error) {
    console.error('Error during login:', error);

    let errorMessage = 'An error occurred during login.';
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    }

    res.status(400).send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '${errorMessage}',
          footer: '<a href="/auth/login">Try again</a>'
        }).then(() => {
          window.location.href = "/auth/login";
        });
      </script>
    `);
  }
});

// Google Login
router.post('/login/google', async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;
    res.json({ success: true });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.json({ success: false, message: error.message });
  }
});

// Facebook Login
router.post('/login/facebook', async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;
    res.json({ success: true });
  } catch (error) {
    console.error('Error during Facebook login:', error);
    res.json({ success: false, message: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
