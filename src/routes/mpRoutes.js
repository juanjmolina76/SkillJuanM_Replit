const express = require('express');
const router = express.Router();
const mpController = require('../controlers/mpController');

router.post('/webhook', mpController.webhook);

module.exports = router;