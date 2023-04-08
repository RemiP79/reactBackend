const Book = require('../models/Book');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    // delete bookObject._id;
    // delete bookObject._userId;    
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'});
    })
    .catch(error => { res.status(400).json( { error });
    })
 };

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => { res.status(200).json(book);
        })
        .catch(error => { res.status(404).json({ error });
        });
    };

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
   // delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId === !req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({_id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => {res.status(200).json({message : 'Objet modifié!'});
                })
                .catch((error) => {res.status(401).json({ error });
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
    };

exports.deleteBook = (req,res,next)=>{
    Book.findOne({ _id: req.params.id})
    
       .then(book => {
        console.log(book);  
        if (book.userId === !req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Livre supprimé !'});
                    })
                       .catch((error) => { res.status(401).json({ error });
                    });
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

exports.getAllBooks = (req, res, next) => {
Book.find()
    .then((books) =>  {  
          
  res.status(200).json(books);}
  )   
    .catch((error) => {res.status(400).json({ error });
    });
};

//////////////////////////////////////

exports.ratingBook =(req, res, next) => {         
    Book.findOne({_id: req.params.id})       
    .then((book) => {
        const found = book.ratings.userId.find(req.auth.userId);

        const add = arr => arr.reduce((a, b) => a + b, 0);        
        const sum = add(book.ratings.grade);       
        const modifRate =         
        ratings.userId.push(req.userId);
        ratings.grade.push(req.rating);
        averageRating = sum/ratings.grade.length;

        if (found === req.auth.userId) {
            res.status(401).json({message : 'Vous ne pouvez pas modifier une évaluation déja saisie'})
        }
            if (book.userId === !req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
            Book.updateOne({_id: req.params.id}, {...modifRate, _id: req.params.id})
                .then(() => {res.status(200).json({message : 'Note prise en compte'});
                })
                .catch((error) => {res.status(401).json({ error });
                });
            }
        })      
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.bestRating=(req, res,next)=>{      
    Book.find()     
    .then((books) =>  {           
    const array=(books).sort((b, a) => a.averageRating - b.averageRating);                   
     res.status(200).json([array[0], array[1], array[2]]);
    })     
    .catch((error) => {res.status(400).json({ error });
    });
};
    
    

