const sharp = require ('sharp');
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
        .toFile(path.resolve(req.file.destination, newName + '.webp')); //webp pour réduire le poids de l'image
    fs.unlinkSync(req.file.path); //suppression du fichier d'origine dans le dossier
    
    oldFileName = req.file.filename; // Met à jour le nom de fichier
  }
  
  next();
};