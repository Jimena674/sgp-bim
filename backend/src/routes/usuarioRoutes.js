const express = require('express');
const router = express.Router();
const usuarioController = requiere('../controllers/usuarioController');
const verificarRol = requiere ('../middlewares/verificarRol');

router.post('/', verificarRol(['Administrador']), usuarioController.crearUsuario);
router.put('/:id', verificarRol(['Administrador']), usuarioController.actualizarUsuario);
router.delete('/:id', verificarRol(['Administrador']), usuarioController.eliminarUsuario);
router.get('/', usuarioController.listarUsuarios);
router.patch('/:id/estado', verificarRol(['Administrador']), usuarioController.cambiarEstadoUsuario);

module.exports = router;