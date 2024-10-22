const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Importa el paquete cors
const app = express();
const multer = require('multer'); // Importa multer
require('dotenv').config();
const { check, validationResult } = require('express-validator');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 2, // límite de 100 peticiones por IP
    message: 'Demasiadas solicitudes desde esta IP, intente de nuevo después de 15 minutos'
});


app.use(limiter);

// Utilizar CORS
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer(); // Puedes configurar storage si necesitas guardar archivos


app.post('/send-email', upload.none(), [
    check('Nombre').trim().not().isEmpty().withMessage('El nombre es obligatorio.'),
    check('mail').isEmail().withMessage('Debe ser un email válido.'),
    check('Mensaje').trim().not().isEmpty().withMessage('El mensaje es obligatorio.')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('Headers:', req.headers); // Verifica los encabezados
    console.log(req.body)
    const { Nombre, mail, Mensaje } = req.body;
    console.log(req.body)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS 
        }
    });

    const mailOptions = {
        from: mail, // Email del remitente
        to: process.env.GMAIL_USER, // Tu email
        subject: `Nuevo mensaje de ${Nombre} del correo ${mail})`,
        text: Mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error: ' + error.message);
        }
        res.send('¡Mensaje enviado exitosamente!');
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
