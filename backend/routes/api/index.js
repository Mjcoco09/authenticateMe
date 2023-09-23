const router = require('express').Router();



router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });










module.exports = router;
//!fuser -n tcp -k 8000
