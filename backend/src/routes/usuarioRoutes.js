const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarRol = require ('../middlewares/verificarRol');
const verificarSesion = require ('../middlewares/verificarSesion');

router.post('/', verificarSesion, verificarRol(['Administrador']), usuarioController.crearUsuario);
router.put('/:id', verificarSesion, verificarRol(['Administrador']), usuarioController.actualizarUsuario);
router.delete('/:id', verificarSesion, verificarRol(['Administrador']), usuarioController.eliminarUsuario);
router.get('/', verificarSesion, usuarioController.listarUsuarios);
router.patch('/:id/estado', verificarSesion, verificarRol(['Administrador']), usuarioController.cambiarEstadoUsuario);

module.exports = router;