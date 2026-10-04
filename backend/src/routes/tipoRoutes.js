const express = require('express');
const router = express.Router();
const tipoController = require('../controllers/tipoController');
const verificarPermiso = require('../middlewares/verificarPermiso');
const verificarSesion = require('../middlewares/verificarSesion');

// Consulta pública (cualquier usuario autenticado) — usada por formularios como el de creación de usuarios
router.get('/', verificarSesion, tipoController.consultarPorModulo); // GET /api/tipos?codigo_modulo=usuarios

router.get('/todos', verificarSesion, verificarPermiso('gestionar_tipos'), tipoController.consultarTodos);

router.post('/', verificarSesion, verificarPermiso('gestionar_tipos'), tipoController.registrarTipo);
router.put('/:id', verificarSesion, verificarPermiso('gestionar_tipos'), tipoController.actualizarTipo);
router.delete('/:id', verificarSesion, verificarPermiso('gestionar_tipos'), tipoController.eliminarTipo);

module.exports = router;