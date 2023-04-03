const express = require ('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/Book');
const router = express.Router();

router.post('/', auth,multer, bookCtrl.createBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);  
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/', auth, bookCtrl.getAllBooks);

module.exports = router;
