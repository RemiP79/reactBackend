const Book = require('../models/Book');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize')

exports.createBook = async (req, res, next) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        const sanitizeBook = sanitize(bookObject);
        const book = new Book({
            ...sanitizeBook,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        await book.save();
        res.status(201).json({ message: 'Objet enregistré !' });
    } catch (error) {
        res.status(400).json({ error });
    }
    };


exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
            res.status(404).json({ error: 'Livre non trouvé !' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error });
    }
};
 
exports.modifyBook = async (req, res, next) => {
    try {
      const bookObject = req.file
        ? {
            ...JSON.parse(cleanIt(req.body.book)),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
        : { ...req.body };  
      const book = await Book.findOne({ _id: req.params.id });  
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
      }  
      if (book.userId !== req.auth.userId) {
         res.status(401).json({ message: 'Not authorized' });
      }  
      await Book.updateOne(
        {_id: req.params.id },
        { ...bookObject, _id: req.params.id });
      res.status(200).json({ message: 'Objet modifié!' });
    } catch (error) {
      res.status(400).json({ error });
    }
  };
  
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (!book) {
             res.status(404).json({ message: 'Livre non trouvé !' });
        }
        if (book.userId !== req.auth.userId) {
             res.status(401).json({ message: 'Non autorisé !' });
        }
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async () => {
            try {
                await Book.deleteOne({ _id: req.params.id });
                 res.status(200).json({ message: 'Livre supprimé !' });
            } catch (error) {
                 res.status(401).json({ error });
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ error });
    }
};
  
exports.ratingBook = async (req, res, next) => {
    if (!req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const book = await Book.findOne({ _id: req.params.id });        
        
        const found = book.ratings.find((r) => r.userId === req.auth.userId);
        if (found) {
            return res.status(401).json({ message: 'Vous ne pouvez pas modifier une évaluation déjà saisie' });
        }
        let tot = 0;
        book.ratings.push({
            userId: req.auth.userId,
            grade: req.body.rating,
        });
        book.ratings.forEach((elt) => {
            tot+=elt.grade;            
        });
        const moyenne = Math.round((tot/book.rating.lenght)*100)/100;        
        book.averageRating = moyenne;
        await Book.updateOne({ _id: req.params.id }, { ...book._doc });
        console.log(book._doc);
        res.status(200).json(book);        
    } catch (error) {
        res.status(400).json({ error });
    }    
};

exports.bestRating = async (req, res, next) => {
    try {
        const books = await Book.find();
        const array = books.sort((a, b) => a.averageRating - b.averageRating);
        const tableau = array.reverse();
        res.status(200).json(tableau.slice(0,3));
    } catch (error) {
        res.status(400).json({ error });
    }
};
    
    

