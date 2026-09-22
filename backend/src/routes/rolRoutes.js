const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const verificarPermiso = require('../middlewares/verificarPermiso');
const verificarSesion = require('../middlewares/verificarSesion');

router.post('/', verificarSesion, verificarPermiso('gestionar_roles'), rolController.registrarRol);
router.get('/', verificarSesion, rolController.consultarRoles);
router.post('/asignar-permiso', verificarSesion, verificarPermiso('gestionar_roles'), rolController.asignarPermiso);
router.put('/revocar-permiso', verificarSesion, verificarPermiso('gestionar_roles'), rolController.revocarPermiso);
router.put('/:id', verificarSesion, verificarPermiso('gestionar_roles'), rolController.actualizarRol);
router.delete('/:id', verificarSesion, verificarPermiso('gestionar_roles'), rolController.eliminarRol);
router.get('/:id/permisos', verificarSesion, rolController.consultarPermisosDeRol);


module.exports = router;