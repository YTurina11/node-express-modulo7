const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreArchivo = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

    cb(null, nombreArchivo);
  }
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG y PDF.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;