exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No se recibió ningún archivo.'
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Archivo subido correctamente.',
      data: {
        archivo: req.file.filename,
        nombreOriginal: req.file.originalname,
        tipo: req.file.mimetype,
        tamaño: req.file.size,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al subir el archivo.',
      error: error.message
    });
  }
};