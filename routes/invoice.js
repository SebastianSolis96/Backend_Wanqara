/* Factura: host + /api/invoice */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { porcentajeIva, importaExistencias, listUltimaFactura, saveFactura, updateFactura, deleteFactura, lastNumFactura, firmaFactura, listFacturaByNumber, listFacturasByParam } = require('../controllers/invoice');
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

router.post( '/actions/ultimonumerofactura', lastNumFactura );

router.post( '/actions/factura', saveFactura );

router.put( '/actions/factura/:id', updateFactura );

router.delete( '/actions/eliminafactura/:id', deleteFactura );

router.post( '/actions/firmafactura/:id', firmaFactura );

router.post( '/actions/facturapornumero/:id', listFacturaByNumber );

router.post( '/actions/facturaporparam/:id', listFacturasByParam );

module.exports = router;
