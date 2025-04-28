import AWS from 'aws-sdk';
import multer from 'multer'; // Usamos multer para procesar archivos (opcional si usas FormData)
import multerS3 from 'multer-s3'; // Usamos multer-s3 para manejar la subida directa a S3

// Configuración de AWS
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'private', // Control de acceso restringido
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Asignamos un nombre único al archivo
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
}).single('file'); // El campo con el que enviarás el archivo en el body

export const handler = async (event) => {
  return new Promise((resolve, reject) => {
    upload(event, null, async function (err) {
      if (err) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ message: 'Error al subir archivo', error: err.message })
        });
      }

      const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${event.file.key}`;

      return resolve({
        statusCode: 200,
        body: JSON.stringify({ message: 'Archivo subido exitosamente', fileUrl })
      });
    });
  });
};
