/* Factura: host + /api/invoice */

//CREACIÓN DE ROUTER
const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { facturaFirmada } = require('../controllers/invoice');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

//Todas las rutas deben pasar por la validación del JWT
router.use( validatorJWT );

router.post( '/autoriza', facturaFirmada );

module.exports = router;
