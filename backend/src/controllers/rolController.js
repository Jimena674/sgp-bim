const RolService = require ('../services/rolService');

async function registrarRol (req, res) {
    try {
        const idNuevoRol = await RolService.registrarRol(req.body);
        res.status(201).json({mensaje: 'Rol creado exitosamente.', id: idNuevoRol});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function actualizarRol(req, res) {
    try {
        await RolService.actualizarRol(req.params.id, req.body);
        res.json({mensaje: 'Rol actualizado con éxito.'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function eliminarRol(req, res) {
    try {
        await RolService.eliminarRol(req.params.id);
        res.json({mensaje: 'Rol eliminado exitosamente.'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function consultarRoles(req, res) {
    try {
        const roles = await RolService.consultarRoles(req.usuario);
        res.json(roles);
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {registrarRol, actualizarRol, eliminarRol, consultarRoles};