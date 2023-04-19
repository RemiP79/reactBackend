const sharp = require ('sharp');

exports.sharpImg = (req,res,next) => {
    try{    
    
    sharp(`images/${req.file.filename}`)
            .resize({width: 200,
                height: 200
                })
                
            .toFile(`images/${req.file.filename}`, (err, info) => {
                if (err) throw err})
            }
            catch (error) {
              res.status(401).json({ error });
              }
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