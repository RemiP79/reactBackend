const {check, validationResult} = require ('express-validator');


exports.checkMail = async (req,res,next) =>{
    try{ 
        await check('email')        
            .trim()        
            .not().isEmpty().withMessage('Saisir une adresse mail')
            .matches('^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+.)+[a-z]{2,5}$').withMessage('ressource matches utilisée')
            .escape().withMessage('ressource escape() utilisée')
            .normalizeEmail().withMessage('ressource normalize utilisée')
            .isEmail().withMessage('Email non conforme')        
            .run(req);
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'impossibe de créer/connecter utilisateur' });
    }  
};

exports.checkPassword = async (req,res,next) =>{
    try{
        await check('password')
            .not().isEmpty().withMessage('Sasir un mot de passe')
            //.matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{1,}$').withMessage('ressource matches mpd utilisée')
            .run(req);
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'impossibe de créer/connecter utilisateur' });
    }  
};


exports.fonctionValider = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array());
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'impossible de créer/connecter utilisateur' });
    } 
};