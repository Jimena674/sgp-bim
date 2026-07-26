const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const verificarRol = require('../middlewares/verificarRol');
const verificarSesion = require('../middlewares/verificarSesion');

router.post('/', verificarSesion, verificarRol(['Administrador']), rolController.registrarRol);
router.get('/', verificarSesion, rolController.consultarRoles);
router.put('/:id', verificarSesion, verificarRol(['Administrador']), rolController.actualizarRol);
router.delete('/:id', verificarSesion, verificarRol(['Administrador']), rolController.eliminarRol);

module.exports = router;