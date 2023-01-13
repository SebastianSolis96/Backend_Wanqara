/* Producto: host + /api/product */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { listProducts, updateProduct } = require('../controllers/product');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.get( '/', listProducts );

router.put( '/edit/:id', [
    check('price', 'Price is required').not().isEmpty(),
    check('price', 'Price can only be a number').isNumeric(),
    fieldValidator
], updateProduct );

module.exports = router;