const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Configura CORS
const corsOptions = {
   origin: 'https://amazon-sp-api-nine.vercel.app', // URL de tu frontend
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
   allowedHeaders: ['Content-Type', 'Authorization', 'x-amz-access-token'], // Headers permitidos
   credentials: true // Si necesitas enviar cookies o autenticación
};

// Aplica CORS
app.use(cors(corsOptions));

// Agrega encabezados CORS adicionales
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'https://amazon-sp-api-nine.vercel.app'); // Cambia según sea necesario
   next();
});

// Maneja solicitudes OPTIONS para la ruta específica
app.options('/marketplace-participations', cors(corsOptions));

// Para manejar JSON en el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para obtener participaciones del marketplace
app.get('/marketplace-participations', async (req, res) => {
   const token = req.headers['x-amz-access-token'];

   if (!token) {
      return res.status(401).json({ error: 'Access token is missing' });
   }

   try {
      const response = await axios.get(
         'https://sellingpartnerapi-na.amazon.com/sellers/v1/marketplaceParticipations',
         {
            headers: {
               'x-amz-access-token': token,
               'Content-Type': 'application/json',
               Accept: 'application/json'
            }
         }
      );
      res.json(response.data);
   } catch (error) {
      console.error('Error al obtener participaciones:', error);
      if (error.response) {
         res.status(error.response.status).json(error.response.data);
      } else {
         res.status(500).json({ error: 'Error interno del servidor' });
      }
   }
});

// Exportar la aplicación
module.exports = app;
