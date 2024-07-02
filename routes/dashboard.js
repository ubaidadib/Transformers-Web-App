const express = require('express');
const { getDoc, doc, collection, query, where, getDocs } = require('firebase/firestore');
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

      // Fetch recent activity (assuming you have an 'activities' collection)
      const activitiesQuery = query(collection(db, 'activities'), where('uid', '==', user.uid));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const recentActivity = activitiesSnapshot.docs.map(doc => doc.data().activity);

      res.render('dashboard', { user: userData, recentActivity, section: 'profile' });
    } else {
      res.render('dashboard', { user: null, recentActivity: [], section: 'profile' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

module.exports = router;
