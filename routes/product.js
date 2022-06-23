/* Producto: host + /api/product */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { listUltimoProducto, listProductoByCodigo, listProductos, listProductosByParam, checkProductoOnInvoices, saveProducto, updateProducto, deleteProducto, listGruposArticulos, listArticulosPorFactura, listProductosByParamAndStore, listProductosByParamConExistencias } = require('../controllers/product');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.post( '/', listUltimoProducto );

router.post( '/:id', listProductoByCodigo );

router.post( '/buscador/productos', listProductos );

router.post( '/buscador/productos/:id', listProductosByParam );

router.post( '/buscadorexistencia/productos/:id', listProductosByParamConExistencias );

router.post( '/buscador/porbodega/productos/:id', listProductosByParamAndStore );

router.post( '/actions/productos', [
    check('codigo', 'El código es obligatorio').not().isEmpty(),
    check('codigo', 'El código debe tener máximo 20 dígitos').isLength({ max: 20 }),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('bodega', 'La bodega es obligatoria').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('precio', 'El precio solo puede ser un número').isNumeric(),
    check('impuesto', 'El impuesto es obligatorio').not().isEmpty(),
    check('impuesto', 'El impuesto solo puede ser un número').isNumeric(),
    check('grupo', 'El grupo es obligatorio').not().isEmpty(),
    check('servicio', 'El servicio es obligatorio').not().isEmpty(),
    check('servicio', 'El servicio solo puede ser un número').isNumeric(),
    fieldValidator
], saveProducto );

router.post( '/actions/productos/:id', checkProductoOnInvoices );

router.put( '/actions/productos/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('bodega', 'La bodega es obligatoria').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('precio', 'El precio solo puede ser un número').isNumeric(),
    check('impuesto', 'El impuesto es obligatorio').not().isEmpty(),
    check('impuesto', 'El impuesto solo puede ser un número').isNumeric(),
    check('grupo', 'El grupo es obligatorio').not().isEmpty(),
    check('servicio', 'El servicio es obligatorio').not().isEmpty(),
    check('servicio', 'El servicio solo puede ser un número').isNumeric(), 
    fieldValidator
], updateProducto );

router.delete( '/actions/productos/:id', deleteProducto );

router.post( '/extra/grupos', listGruposArticulos );

router.post( '/extra/artbyfactura', listArticulosPorFactura );

module.exports = router;