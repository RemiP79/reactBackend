const express = require('express');
const validator = require('../middleware/validator');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require ('express-rate-limit');

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 4 requests per `window` (here, per 15 minutes)
    message:
      'Too many accounts created from this IP, please try again after 3 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/signup',
        [validator.checkMail,
        validator.checkPassword],
        validator.fonctionValider,
        userCtrl.signup);

router.post('/login',
        limiter,
        [validator.checkMail,
        validator.checkPassword],
        validator.fonctionValider,
        userCtrl.login);

module.exports = router;