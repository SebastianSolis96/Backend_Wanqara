/* Autenticación: host + /api/auth */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { 
    login,  
    renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');


router.post( '/login', 
    [ //middlewares
        check( 'user', 'User is required' ).not().isEmpty().isEmail(),
        check( 'pass', 'Password is required' ).not().isEmpty(),
        fieldValidator
    ],
    login );

router.get('/renew', validatorJWT , renewToken);

module.exports = router;