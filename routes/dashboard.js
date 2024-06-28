const express = require('express');
const { getDoc, doc } = require('firebase/firestore');
const { db } = require('../firebaseConfig');
const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const user = req.session.user;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      res.render('dashboard', { user: userData });
    } else {
      console.log('User document not found for UID:', user.uid); // Log the missing UID for debugging
      res.render('dashboard', { user: null });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

module.exports = router;
