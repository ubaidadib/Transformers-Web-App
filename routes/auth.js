const express = require('express');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } = require('firebase/auth');
const { auth, db } = require('../firebaseConfig');
const { setDoc, doc, getDoc } = require('firebase/firestore');
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
  try {
    if (await verifyRecaptcha(recaptchaToken)) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Add user to Firestore with UID as the document ID
      const userDoc = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: new Date()
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

      req.session.user = userCredential.user;

      // Redirect to profile setup screen
      res.redirect('/profile/setup');
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

router.post('/signup/google', async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;

    // Check if the user document exists, if not create one
    const userDocRef = doc(db, 'users', decodedToken.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const userDoc = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        createdAt: new Date()
      };
      await setDoc(userDocRef, userDoc);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error during Google signup:', error);
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

router.post('/signup/facebook', async (req, res) => {  
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.session.user = decodedToken;

    // Check if the user document exists, if not create one
    const userDocRef = doc(db, 'users', decodedToken.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const userDoc = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        createdAt: new Date()
      };
      await setDoc(userDocRef, userDoc);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error during Facebook signup:', error);
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

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
