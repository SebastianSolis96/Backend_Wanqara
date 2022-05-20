/* Factura: host + /api/invoice */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { porcentajeIva, importaExistencias, listUltimaFactura } = require('../controllers/invoice');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.post( '/porcentajeiva', porcentajeIva );

router.post( '/importaexistencias', importaExistencias );

router.post( '/ultimafactura', listUltimaFactura );

module.exports = router;
