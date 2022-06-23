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
app.use('/api/product', require('./routes/product') );
app.use('/api/store', require('./routes/store') );
app.use('/api/invoice', require('./routes/invoice') );
app.use('/api/method', require('./routes/methodPay') );
app.use('/api/seller', require('./routes/seller') );

app.get('*', (req, res)=>{
    res.sendFile( __dirname + '/public/index.html');
});

//ESCUCHAR PETICIONES
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
});