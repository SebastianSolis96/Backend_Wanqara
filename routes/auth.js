/* Autenticación: host + /api/auth */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { credentialsValidator, loginScae, listEmpresas, listEmpresaByCodigo, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

router.post( '/', 
    [ //middlewares
        check( 'user', 'El usuario es obligatorio' ).not().isEmpty(),
        check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
        check( 'database', 'La base de datos es obligatoria' ).not().isEmpty(),
        fieldValidator
    ],
    credentialsValidator );

router.post( '/login', 
    [ //middlewares
        check( 'userScae', 'El usuario es obligatorio' ).not().isEmpty(),
        check( 'passwordScae', 'La contraseña es obligatoria' ).not().isEmpty(),
        fieldValidator
    ],
    loginScae );

router.get('/empresas', validatorJWT, listEmpresas);

router.get('/miempresa', validatorJWT, listEmpresaByCodigo);

router.get('/renew', validatorJWT , renewToken);

module.exports = router;