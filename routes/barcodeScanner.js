// barcodeScanner.js

const express = require('express');
const router = express.Router();
const { db } = require('../firebaseConfig');
const { doc, setDoc, getDoc } = require('firebase/firestore');

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('barcodeScanner', { user: req.session.user });
});

router.post('/scan', async (req, res) => {
  const { barcode, feedback } = req.body;
  const user = req.session.user;

  try {
    // Check if the scanned item already exists in the database
    const scannedItemRef = doc(db, 'scannedItems', `${user.uid}_${barcode}`);
    const scannedItemSnap = await getDoc(scannedItemRef);

    let scanData;

    if (!scannedItemSnap.exists()) {
      // If it doesn't exist, save the new scanned item
      scanData = {
        barcode,
        feedback,
        userId: user.uid,
        timestamp: new Date(),
        additionalInfo: 'Example additional information' // Example additional information
      };
      await setDoc(scannedItemRef, scanData);
    } else {
      // If it exists, use the existing data
      scanData = scannedItemSnap.data();
    }

    res.json({ success: true, data: scanData });
  } catch (error) {
    console.error('Error saving scan data:', error);
    res.status(500).json({ success: false, error: 'Failed to save scan data' });
  }
});

module.exports = router;
