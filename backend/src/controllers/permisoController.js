const PermisoService = require('../services/permisoService');

async function consultarPermisos(req, res) {
    try {
        const permisos = await PermisoService.obtenerTodos();
        res.json(permisos);
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {consultarPermisos};