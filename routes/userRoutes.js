const express = require('express');
const validator = require('../middleware/validator');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup',
    [validator.checkMail,validator.checkPassword
    ],
    validator.fonctionValider,
    userCtrl.signup
);

router.post('/login',
    [validator.checkMail,validator.checkPassword
    ],
    validator.fonctionValider,
    userCtrl.login
);

module.exports = router;