const express = require('express');
const router = express.Router();
const moduloController = require('../controllers/moduloController');
const verificarSesion = require('../middlewares/verificarSesion');

router.get('/', verificarSesion, moduloController.consultarModulos);

module.exports = router;