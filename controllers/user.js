const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoSanitize = require('express-mongo-sanitize');
require("dotenv").config();

exports.signup  = async (req, res, next) => {         
try { 
    //if = Partie à enlever lors de la validation de mongoose unique validator
    // const userExist = await User.findOne({email:req.body.email})
    //      if(userExist){
    //             res.status(400).json({message : 'Email incorrect, merci de modifier votre email'})
    //         }  
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    mongoSanitize.sanitize({user}, {
        allowDots: true
      });
   user.password =  await bcrypt.hash(req.body.password, 10);               
    const userSaved = await user.save();
    if (userSaved) {     
        res.status(201).json({ message: 'Utilisateur créé avec succès !' });                                           
         }else{
        res.status(401).json({ message: 'problème user.save()' });
        }    
    }
catch (error) {
    res.status(401).json({ message: 'impossibe de créer utilisateur' });
    }   
};

 exports.login = async (req, res, next) => {
    try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
    res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
    res.status(401).json({ error: 'Mot de passe incorrect !' });
    }
    res.status(200).json({
        userId: user._id,
        token: jwt.sign(
            { userId: user._id },
            process.env.TOKEN_KEY,
            { expiresIn: '24h' }
        )
    });
    } catch (error) {
    res.status(500).json({ error });
    }
    };