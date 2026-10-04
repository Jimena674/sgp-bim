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

async function asignarPermiso(req, res) {
    try {
        const idAsignacion = await RolService.asignarPermiso(req.body.codigo_rol, req.body.codigo_permiso, req.usuario.id);
        res.status(201).json({mensaje: 'Permiso asignado exitosamente.', id:idAsignacion})
    } catch (error) {
        res.status(error.estado || 400).json({error:error.message});
    }
}

async function revocarPermiso(req, res) {
    try {
        await RolService.revocarPermiso(req.body.codigo_rol, req.body.codigo_permiso, req.usuario.id);
        res.status(200).json({mensaje:'Permiso revocado de manera exitosa.'})
    } catch (error) {
        res.status(error.estado || 400).json({error:error.message});
    }
}

async function consultarPermisosDeRol(req, res) {
    try {
        const permisos = await RolService.obtenerPermisosDeRol(req.params.id);
        res.json(permisos);
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function consultarAsignacionesPermisos(req, res) {
    try {
        res.json(await RolService.obtenerAsignacionesPermisos());
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {registrarRol, actualizarRol, eliminarRol, consultarRoles, asignarPermiso, revocarPermiso, consultarPermisosDeRol, consultarAsignacionesPermisos};