const TipoService = require('../services/tipoService');

async function registrarTipo(req, res) {
    try {
        const idNuevoTipo = await TipoService.registrarTipo(req.body);
        res.status(201).json({mensaje: 'Tipo creado exitosamente.', id: idNuevoTipo});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function actualizarTipo(req, res) {
    try {
        await TipoService.actualizarTipo(req.params.id, req.body);
        res.json({mensaje: 'Tipo actualizado con éxito.'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function eliminarTipo(req, res) {
    try {
        await TipoService.eliminarTipo(req.params.id);
        res.json({mensaje: 'Tipo eliminado exitosamente.'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function consultarTodos(req, res) {
    try {
        res.json(await TipoService.consultarTodos());
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function consultarPorModulo(req, res) {
    try {
        res.json(await TipoService.consultarPorModulo(req.query.codigo_modulo));
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {registrarTipo, actualizarTipo, eliminarTipo, consultarTodos, consultarPorModulo};