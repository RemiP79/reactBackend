const sharp = require ('sharp');
const multer = require ('./multer-config');
const fs = require ('fs');
const path = require ('path');

let oldFileName = '';

module.exports = async (req,res,next) => {    
  if(req.file && req.file.filename !== oldFileName) { // Vérifie si le fichier a été modifié
    console.log(req.file);  
    const newName = req.file.filename.split('.')[0];
    req.file.filename = newName + '.webp';

    await sharp(req.file.path)    
        .resize(300)                
        .toFile(path.resolve(req.file.destination, newName + '.webp'));
    fs.unlinkSync(req.file.path);
    
    oldFileName = req.file.filename; // Met à jour le nom de fichier
  }
  
  next();
};

// exports.sharpImg = (req,res,next) => {
// //const imagePath = req.file.filename;

// sharp(`img/${req.file.filename}`)
//         .resize({width: 200,
//             height: 200,
//             fit: sharp.fit.cover})
//         .toFile(`images/${req.file.filename}.jpg`, (err, info) => {
//             if (err) throw err})
//         };


        // const resizeImage =  (req, res, next) => {
  
//   if (!req.file) {
//     return next(new Error('Aucun fichier téléchargé'));
//   }
//   sharp(req.file.path)
//     .resize(300)
//     .toFile(`images/resize_${req.file.filename}`, (err, info) => { 
//       if (err) {
//         return next(err);
//       }
//       console.log(info);
//       res.send('Image redimensionnée avec succès');
//     })};