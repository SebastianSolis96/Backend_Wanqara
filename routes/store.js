/* Bodega: host + /api/store */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { listBodegas } = require('../controllers/store');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.post( '/', listBodegas );

module.exports = router;