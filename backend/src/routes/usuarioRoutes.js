const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarPermiso = require ('../middlewares/verificarPermiso');
const verificarSesion = require ('../middlewares/verificarSesion');

router.post('/', verificarSesion, verificarPermiso('gestionar_usuarios'), usuarioController.crearUsuario);
router.post('/asignar-rol', verificarSesion, verificarPermiso('gestionar_usuarios'), usuarioController.asignarRol);
router.put('/revocar-rol', verificarSesion, verificarPermiso('gestionar_usuarios'), usuarioController.revocarRol);
router.put('/:id', verificarSesion, verificarPermiso('gestionar_usuarios'), usuarioController.actualizarUsuario);
router.get('/', verificarSesion, usuarioController.listarUsuarios);
router.patch('/:id/estado', verificarSesion, verificarPermiso('gestionar_usuarios'), usuarioController.cambiarEstadoUsuario);

module.exports = router;