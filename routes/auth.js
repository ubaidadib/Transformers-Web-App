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

      // Redirect to the main screen after successful signup
      res.redirect('/');
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      req.session.user = userCredential.user;
      res.redirect('/');
    } else {
      throw new Error('Failed reCAPTCHA verification');
    }
  } catch (error) {
    console.error('Error during login:', error);

    let errorMessage = 'An error occurred during login.';
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid password. Please try again.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No user found with this email. Please sign up first.';
    } else if (error.code === 'auth/invalid-credential') {
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

router.post('/login/google', async (req, res) => {
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

    res.redirect('/');
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(400).send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '${error.message}',
          footer: '<a href="/auth/login">Try again</a>'
        }).then(() => {
          window.location.href = "/auth/login";
        });
      </script>
    `);
  }
});

router.post('/login/facebook', async (req, res) => {  
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

    res.redirect('/');
  } catch (error) {
    console.error('Error during Facebook login:', error);
    res.status(400).send(`
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '${error.message}',
          footer: '<a href="/auth/login">Try again</a>'
        }).then(() => {
          window.location.href = "/auth/login";
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
