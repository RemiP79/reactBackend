const jwt = require('jsonwebtoken');
require("dotenv").config();
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; //Extraction du token du header Authorization après le bearer
       const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
        res.status(401).json({ message: "Invalid token"});
   }
};