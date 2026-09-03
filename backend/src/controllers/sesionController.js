const SesionService = require('../services/sesionService');

async function login(req,res){
    try {
        const resultado = await SesionService.login(req.body.numero_id, req.body.password, req.ip);
        res.json({mensaje:'Ha iniciado sesión de manera exitosa.', token: resultado.token, nombre_usuario: resultado.nombre_usuario});
    } catch(error) {
        res.status(error.estado || 400).json({error:error.message});
    }
}

async function logout(req,res){
    try {
        await SesionService.logout(req.id_sesion);
        res.json({mensaje:'Ha cerrado sesión de manera exitosa'});
    } catch(error) {
        res.status(error.estado || 400).json({error:error.message});
    }
}

async function consultarHistorial(req,res) {
    try {
        const sesiones = await SesionService.consultarHistorial(req.query);
        res.json(sesiones);
    } catch(error) {
        res.status(error.estado || 400).json({error:error.message});
    }
}

module.exports = {login, logout, consultarHistorial};