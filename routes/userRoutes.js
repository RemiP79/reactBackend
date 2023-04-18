const express = require('express');
const router = express.Router();
const {check, validationResult} = require ('express-validator');
const User = require('../models/User');

const userCtrl = require('../controllers/user');

router.post('/signup',
[
  check('email')
        .trim()
        .not().isEmpty().withMessage('Saisir une adresse mail')
        .isEmail().withMessage('Email non conforme')
        .escape().withMessage('ressource escape() utilisée')
        .normalizeEmail().withMessage('ressource normalize utilisée')        
        .custom(async email => {
                        if ((await User.findOne({ email }))) {
                            throw new Error('A user already exists with that email');
                        }
                    }),    
  check('password')
            .not().isEmpty().withMessage('Sasir un mot de passe')
            .isLength({min: 5}).withMessage('5 caratères minimum'),
  ],
   function (req, res, next) {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }next();
  },
 
// [
//     check('email','Email non valide')
//         .notEmpty().withMessage('Saisir une adresse mail')
//         .isEmail().withMessage('format email non valide')
//         .normalizeEmail()
//         .custom(async email => {
//             if ((await User.findOne({ email }))) {
//                 throw new Error('A user already exists with that email');
//             }
//         })
//         .isLength({max: 50}).withMessage('Email invalide : maxi 50 caractères'),
    
//     check('password', 'Your password must be at least 5 characters')
//         .notEmpty().withMessage('Sasir un mot de passe')
//         .isLength({min: 5}).withMessage('5 caratères minimum'),
// ],
//   function (req, res, next) {
//     const errors = validationResult(req);
//     console.log(req.body);

//     if (!errors.isEmpty()) {
//         return res.status(422).jsonp(errors.array());
//     } next();
    
//   },
userCtrl.signup);

router.post('/login',  userCtrl.login);

module.exports = router;