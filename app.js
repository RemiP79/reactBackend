const express = require('express');
const helmet = require('helmet');
const rateLimit = require ('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require ('./routes/userRoutes');
const path = require('path');
require("dotenv").config();

const mongoose = require('mongoose');

const connexionMongoose = async() =>{
try{
    await mongoose.connect(process.env.DBLINK, {
      useNewUrlParser: true,
       useUnifiedTopology: true,
     });
     console.log("Connexion à MongoDB réussie !");
    }
catch{
  ((err) => console.log("Connexion à MongoDB échouée !", err));
    }
  };
  connexionMongoose();

const app = express();
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  }),
);
//permettre l'Utilisation de helmet qui bloque l'acces aux images
app.use(
        helmet.contentSecurityPolicy({
          directives:{
          imgsrc : process.env.helmetImgSrc
        }})        
        );


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
		'Too many accounts created from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter);


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


 
app.use('/images', express.static(path.join(__dirname, 'images'))); // mise avant pour indiquer à Express qu'il faut gérer la ressource images de manière statique 
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;