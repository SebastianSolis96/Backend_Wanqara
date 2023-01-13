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
app.use('/api/product', require('./routes/product') );
app.use('/api/category', require('./routes/category') );

app.get('*', (req, res)=>{
    res.sendFile( __dirname + '/public/index.html');
});

//ESCUCHAR PETICIONES
app.listen( process.env.PORT, () => {
    console.log(`Server running on port ${ process.env.PORT }`);
});