const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.signup  = async (req, res, next) => {         
try { 
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    
   user.password =  await bcrypt.hash(req.body.password, 10);  //Hachage mdp utilisateur           
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
        //Verification des informations d'identification (findOne et compare bcrypt)
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
           return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        const valid = await bcrypt.compare(req.body.password, user.password); //RP bcrypt compare le mdp saisi/haché et le mdp stocké/haché dans BDD
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
            userId: user._id,   
            token: jwt.sign( // methode sign pour chiffrer un nouveau token.
                { userId: user._id }, //renvoyer l'id de l'utilisateur depuis la base de donnée
                process.env.TOKEN_KEY, //renvoie token web
                { expiresIn: '24h' }
            )
        });
    } catch (error) {
    res.status(500).json({ error });
    }
};