const express = require ('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/Book');
const router = express.Router();


router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.bestRating);
router.post('/:id/rating', auth, bookCtrl.ratingBook); 
router.put('/:id', auth, multer, bookCtrl.modifyBook); 
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, bookCtrl.createBook);


module.exports = router;
