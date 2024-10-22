const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', async (req, res) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Cargar la clave secreta del .env
    const response = req.body['g-recaptcha-response'];

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${response}`;

    try {
        const verificationResponse = await axios.post(verificationUrl);
        const { success } = verificationResponse.data;

        if (success) {
            res.send('¡Formulario enviado exitosamente!');
        } else {
            res.send('Por favor, completa el CAPTCHA correctamente.');
        }
    } catch (error) {
        res.status(500).send('Error en la verificación del CAPTCHA.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
