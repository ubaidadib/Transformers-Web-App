const express = require('express');
const { getDoc, doc, updateDoc } = require('firebase/firestore');
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
      res.render('dashboard', { user: userData, section: 'profile' });
    } else {
      res.render('dashboard', { user: null, section: 'profile' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

router.post('/update', async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send('Unauthorized');
  }

  const { displayName, email } = req.body;
  const user = req.session.user;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      displayName,
      email
    });

    req.session.user.email = email; // Update session email if changed

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Error updating user data');
  }
});

module.exports = router;
