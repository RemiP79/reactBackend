const express = require('express');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require ('./routes/userRoutes');
const path = require('path');
require("dotenv").config();

//Connection à mongoDB
const mongoose = require('mongoose');

const connexionMongoose = () =>{
  try{
      mongoose.connect(process.env.DBLINK, {
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
  
//permettre l'Utilisation de helmet qui bloque l'acces aux images
app.use(
    helmet.contentSecurityPolicy({
      directives:{
      imgsrc : process.env.helmetImgSrc
    }})        
);

//Pour gérer la requête POST venant de l'application front-end,
// on a besoin d'en extraire le corps JSON.
app.use(express.json());

app.use(sanitize());

// CORS 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //accéder à notre API depuis n'importe quelle origine, à modifier en cas de passage en build
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); // mise avant pour indiquer à Express qu'il faut gérer la ressource images de manière statique 
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;