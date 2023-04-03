const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require ('./routes/userRoutes');
const path = require('path');
require("dotenv").config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DBLINK, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch((err) => console.log("Connexion à MongoDB échouée !", err));


const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('./api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;