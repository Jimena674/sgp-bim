const ModuloService = require('../services/moduloService');

async function consultarModulos(req, res) {
    try {
        res.json(await ModuloService.consultarTodos());
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {consultarModulos};