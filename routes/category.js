/* Categoría: host + /api/category */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const listCategoriesWithPromotion = require('../controllers/category');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.get( '/', listCategoriesWithPromotion );

module.exports = router;