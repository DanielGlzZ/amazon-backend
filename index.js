const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Importa Axios

app.use(cors());
app.use(bodyParser.json()); // Para manejar JSON en el cuerpo de las solicitudes

// Ruta para obtener participaciones del marketplace
app.get('/marketplace-participations', async (req, res) => {
   const token = req.headers['x-amz-access-token']; // Obtén el token del encabezado

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
      res.json(response.data); // Envía la respuesta de la API a tu cliente
   } catch (error) {
      console.error('Error al obtener las participaciones:', error);
      if (error.response) {
         res.status(error.response.status).json(error.response.data);
      } else {
         res.status(500).json({ error: 'Error interno del servidor' });
      }
   }
});
// Exportar la aplicación
module.exports = app;
