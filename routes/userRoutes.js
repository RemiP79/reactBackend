const express = require('express');
const {checkMail,checkPassword,fonctionValider } = require('../middleware/validator');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require ('express-rate-limit');

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 5, // Limite 5 requêtes pour 3 minutes
    message:
      'Too many accounts created from this IP, please try again after 3 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/signup',
        checkMail,
        checkPassword,
        fonctionValider,
        userCtrl.signup);

router.post('/login',
        limiter,
        checkMail,
        checkPassword,
        fonctionValider,
        userCtrl.login);

module.exports = router;