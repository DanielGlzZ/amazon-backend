const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Configura CORS
const corsOptions = {
   origin: 'https://amazon-sp-api-nine.vercel.app', // Asegúrate de que esta URL sea la correcta
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'x-amz-access-token'],
   credentials: true
};

// Aplica CORS
app.use(cors(corsOptions));

// Maneja solicitudes OPTIONS para cualquier ruta
app.options('*', cors(corsOptions));

app.use(bodyParser.json());

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

module.exports = app;
