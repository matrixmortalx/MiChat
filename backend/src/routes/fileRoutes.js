const express = require('express');

const router = express.Router();

// File routes placeholder
router.post('/upload', (req, res) => {
  res.json({ success: true, message: 'Upload file - Coming soon' });
});

router.get('/:fileId', (req, res) => {
  res.json({ success: true, message: 'Download file - Coming soon' });
});

module.exports = router;
