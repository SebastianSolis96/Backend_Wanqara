/* Factura: host + /api/invoice */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { porcentajeIva, importaExistencias, listUltimaFactura, saveFactura } = require('../controllers/invoice');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.post( '/porcentajeiva', porcentajeIva );

router.post( '/importaexistencias', importaExistencias );

router.post( '/ultimafactura', listUltimaFactura );

// router.post( '/actions/factura', [
//     check('invoice', 'No hay nada para guardar').not().isEmpty(),
//     fieldValidator
// ], saveFactura );

router.post( '/actions/factura', saveFactura );

module.exports = router;
