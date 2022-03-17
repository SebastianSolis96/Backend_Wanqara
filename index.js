const express = require('express');
const cors = require('cors');
require('dotenv').config();

//CREAR EL SERVIDOR EXPRESS
const app = express();

//CORS
app.use(cors());

//DIRECTORIO PÚBLICO
app.use( express.static('public') );

//LECTURA Y PARSEO DEL BODY
app.use( express.json() );

//RUTAS
app.use('/api/auth', require('./routes/auth') );
app.use('/api/client', require('./routes/client') );

//ESCUCHAR PETICIONES
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
});