const multer = require('multer');

const maxSize = 1 * 1024 * 1024 ;

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'  
};

const multerFilter = (req, file, cb) => {
      if(file.mimetype.startsWith('image')) {
          cb(null, true);
      } else {
          cb({ message: 'Le fichier selectionné n\'est pas une image'}, false);
      }
  };

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const namepop = name.split('.');
    namepop.pop();
    const namePoint = namepop.join('.');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, namePoint + Date.now() + '.' + extension);
  }
});

module.exports = multer({
  storage: storage, 
  limits : maxSize,
  fileFilter : multerFilter,
  }).single('image');