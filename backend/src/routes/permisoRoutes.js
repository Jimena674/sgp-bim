const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const verificarSesion = require('../middlewares/verificarSesion');
const verificarPermiso = require('../middlewares/verificarPermiso');

router.get('/', verificarSesion, verificarPermiso('gestionar_roles'), permisoController.consultarPermisos);

module.exports = router;