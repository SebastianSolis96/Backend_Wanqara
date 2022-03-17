/* Cliente: host + /api/client */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { listUltimoCliente, listClientes, listClienteByCodigo, listClientesByParam, saveCliente, updateCliente, deleteCliente } = require('../controllers/client');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.get( '/', listUltimoCliente );

router.get( '/:id', listClienteByCodigo );

router.get( '/buscador/clientes', listClientes );

router.get( '/buscador/clientes/:id', listClientesByParam );

router.post( '/', [
    check('codigo', 'El código es obligatorio').not().isEmpty(),
    check('ruc', 'El RUC es obligatorio').not().isEmpty(),
    check('ruc', 'El RUC debe tener al menos 10 dígitos').isLength({ min: 10 }),
    check('nombre', 'El nombre del cliente es obligatorio').not().isEmpty(),
    check('correo', 'El correo electrónico debe ser uno válido').if(check('correo').not().equals('')).isEmail(), 
    fieldValidator
], saveCliente );

router.put( '/:id', [
    check('ruc', 'El RUC es obligatorio').not().isEmpty(),
    check('ruc', 'El RUC debe tener al menos 10 dígitos').isLength({ min: 10 }),
    check('nombre', 'El nombre del cliente es obligatorio').not().isEmpty(),
    check('correo', 'El correo electrónico debe ser uno válido').if(check('correo').not().equals('')).isEmail(), 
    fieldValidator
], updateCliente );

router.delete( '/:id', deleteCliente );

module.exports = router;