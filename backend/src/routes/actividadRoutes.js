const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const verificarPermiso = require('../middlewares/verificarPermiso');
const verificarSesion = require('../middlewares/verificarSesion');

router.get('/', verificarSesion, verificarPermiso('consultar_actividades'), actividadController.consultarActividades);
router.post('/', verificarSesion, verificarPermiso('crear_actividad'), actividadController.registrarActividad);
router.put('/:id', verificarSesion, verificarPermiso('editar_actividad'), actividadController.actualizarActividad);
router.delete('/:id', verificarSesion, verificarPermiso('eliminar_actividad'), actividadController.eliminarActividad);

module.exports = router;