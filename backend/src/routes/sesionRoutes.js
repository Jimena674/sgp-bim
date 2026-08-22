const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');
const verificarPermiso = require('../middlewares/verificarPermiso');
const verificarSesion = require('../middlewares/verificarSesion');

router.post('/login', sesionController.login);
router.patch('/logout', verificarSesion, sesionController.logout);
router.get('/', verificarSesion, verificarPermiso('consultar_historial_acceso'), sesionController.consultarHistorial);

module.exports = router;