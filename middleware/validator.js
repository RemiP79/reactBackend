const {check, validationResult} = require ('express-validator');

exports.checkMail = async (req,res,next) =>{
    try{ 
        await check('email')        
            .trim()        
            .not().isEmpty().withMessage('Saisir une adresse mail')
            .matches('^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+.)+[a-z]{2,5}$').withMessage('ressource matches utilisée')
            .escape().withMessage('ressource escape() utilisée')
            .normalizeEmail().withMessage('ressource normalize utilisée')
            .isEmail().withMessage('ressource isEmail utilisée : email non conforme')        
            .run(req);
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'email : impossibe de créer/connecter utilisateur' });
    }  
};

exports.checkPassword = async (req,res,next) =>{
    try{
        await check('password')
            .not().isEmpty().withMessage('Sasir un mot de passe')
            .isStrongPassword( {
                minLength: 8, 
                minLowercase :1,
                minUppercase : 1,
                minNumbers : 1,                                
                minSymbols: 0,
                returnScore: false,
                pointsPerUnique: 0,
                pointsPerRepeat: 0,
                pointsForContainingLower: 0,
                pointsForContainingUpper: 0,
                pointsForContainingNumber: 0,
                pointsForContainingSymbol: 0}).withMessage('mdp pas suffisemment fort')
            .run(req);
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'pwd : impossibe de créer/connecter utilisateur' });
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