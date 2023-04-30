const multer = require('multer');

const maxSize = 6*1024*1024;

//Indiquer quels formats sont acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp' : 'webp' 
};

//Vérifier que le fichiers soit bien une image
const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({ message: 'Le fichier selectionné n\'est pas une image'}, false);
    }
};

// Où stocker l'image et sous quel nom
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const namepop = name.split('.');
    namepop.pop();
    const namePoint = namepop.join('.');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, Date.now() +'_' + namePoint +  '.' + extension);
  }
});

  const upload = multer({
    storage: storage,
    limits: { file: 1, fileSize: maxSize },
    fileFilter: multerFilter,
});

module.exports = (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) return res.status(400).send({ error });
        next();
    });
};