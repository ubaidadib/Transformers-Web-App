const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, db } = require('../firebaseConfig');
const { updateDoc, doc, getDoc } = require('firebase/firestore');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/setup', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('profileSetup');
});

router.post('/setup', upload.single('profilePicture'), async (req, res) => {
  const { displayName, recyclingGoals } = req.body;
  try {
    const userRef = doc(db, 'users', req.session.user.uid);
    const profilePicture = req.file ? `/images/uploads/${req.file.filename}` : '';
    const updateData = {
      displayName,
      recyclingGoals,
      profilePicture
    };

    await updateDoc(userRef, updateData);
    res.redirect('/');
  } catch (error) {
    console.error('Error during profile setup:', error);
    res.status(500).send('Error during profile setup');
  }
});

router.post('/update', upload.single('profilePicture'), async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { displayName, email } = req.body;
  const profilePicture = req.file ? `/images/uploads/${req.file.filename}` : '';
  
  try {
    const userRef = doc(db, 'users', req.session.user.uid);
    const updateData = {
      displayName,
      email,
    };

    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    await updateDoc(userRef, updateData);

    // Update session user
    req.session.user.displayName = displayName;
    req.session.user.email = email;
    if (profilePicture) {
      req.session.user.profilePicture = profilePicture;
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Error updating user data');
  }
});

module.exports = router;
