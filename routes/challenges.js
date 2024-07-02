const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('challenges');
});

module.exports = router;
