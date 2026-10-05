const ActividadService = require('../services/actividadService');

async function registrarActividad(req, res) {
    try {
        const id = await ActividadService.registrarActividad(req.body, req.usuario.id);
        res.status(201).json({mensaje: 'Actividad creada exitosamente.', id});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function actualizarActividad(req, res) {
    try {
        await ActividadService.actualizarActividad(req.params.id, req.body, req.usuario.id);
        res.json({mensaje: 'Actividad actualizada con éxito.'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function eliminarActividad(req, res) {
    try {
        await ActividadService.eliminarActividad(req.params.id, req.usuario.id);
        res.json({mensaje: 'Actividad eliminada exitosamente.'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function consultarActividades(req, res) {
    try {
        const {pagina, tamano, busqueda} = req.query;
        res.json(await ActividadService.consultarActividades({pagina, tamano, busqueda}));
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {registrarActividad, actualizarActividad, eliminarActividad, consultarActividades};