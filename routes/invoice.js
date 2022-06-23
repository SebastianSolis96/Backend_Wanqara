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

router.post( '/actions/ultimonumerofactura', lastNumFactura );

// router.post( '/actions/factura', saveFactura );

router.post( '/actions/factura', [
    check('factura', 'El número de factura es obligatorio').not().isEmpty(),
    check('factura', 'El número de factura debe tener 15 dígitos y no puede contener caracteres especiales o letras').isNumeric().isLength({ min: 15, max: 15 }),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    check('vence', 'La fecha de vencimiento es obligatoria').not().isEmpty(),
    check('tip', 'El tipo de factura es obligatorio').not().isEmpty(),
    check('tip', 'El tipo de factura debe tener solo un valor').isLength({ min: 1, max: 1 }),
    check('comentario', 'El comentario de factura debe tener máximo mil caracteres').isLength({ min: 0, max: 1000 }),
    check('dividendos', 'La forma de pago es obligatoria').not().isEmpty(),
    check('dividendos', 'La forma de pago debe tener máximo 3 caracteres').isLength({ min: 1, max: 3 }),
    check('vendedor', 'El vendedor es obligatorio').not().isEmpty(),
    check('vendedor', 'El vendedor debe tener máximo 5 caracteres').isLength({ min: 1, max: 5 }),
    check('bodega', 'La bodega es obligatoria').not().isEmpty(),
    check('bodega', 'La bodega debe tener máximo 2 caracteres').isLength({ min: 1, max: 2 }),
    check('cliente', 'El cliente es obligatorio').not().isEmpty(),
    check('cliente', 'El cliente debe tener máximo 15 caracteres').isLength({ min: 1, max: 15 }),
    check('ruc', 'El ruc es obligatorio').not().isEmpty(),
    check('ruc', 'El ruc debe tener máximo 15 caracteres').isLength({ min: 1, max: 15 }),
    check('nombrec', 'El nombre es obligatorio').trim().not().isEmpty(),
    check('nombrec', 'El nombre debe tener máximo 100 caracteres').trim().isLength({ min: 1, max: 100 }),
    check('direccion', 'La direccion debe tener máximo 100 caracteres').trim().isLength({ min: 0, max: 100 }),
    check('telefono', 'El telefono debe tener máximo 30 caracteres').trim().isLength({ min: 0, max: 30 }),
    check('email', 'El email debe tener máximo 100 caracteres').trim().isLength({ min: 0, max: 100 }),
    check('base_0', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('base_i', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('bruto', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('descto', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('impuesto', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('neto', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('pdescto', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('total', 'Hay datos que deben ser numéricos y tienen letras o caracteres especiales').isNumeric(),
    check('listProducts', 'Debe existir productos').not().isEmpty(),
    fieldValidator
], saveFactura );

router.put( '/actions/factura/:id', updateFactura );

router.delete( '/actions/eliminafactura/:id', deleteFactura );

router.post( '/actions/firmafactura/:id', firmaFactura );

router.post( '/actions/facturapornumero/:id', listFacturaByNumber );

router.post( '/actions/facturaporparam/:id', listFacturasByParam );

module.exports = router;