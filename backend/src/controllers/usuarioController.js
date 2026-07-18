const UsuarioService = require('../services/usuarioService');

async function crearUsuario(req, res) {
    try {
        const idNuevoUsuario = await UsuarioService.registrarUsuario(req.body, req.usuario.id);
        res.status(201).json({mensaje:'Usuario creado exitosamente', id: idNuevoUsuario});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function actualizarUsuario(req, res) {
    try {
        await UsuarioService.actualizarUsuario(req.params.id, req.body);
        res.json({mensaje: 'Usuario actualizado exitosamente'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
    
}

async function eliminarUsuario(req, res) {
    try {
        await UsuarioService.eliminarUsuario(req.params.id);
        res.json({mensaje: 'Usuario eliminado exitosamente'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function cambiarEstadoUsuario (req, res) {
    try {
        await UsuarioService.cambiarEstadoUsuario(req.params.id, req.body.id_estado, req.usuario.id);
        res.json({mensaje: 'Estado del usuario actualizado exitosamente'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function listarUsuarios (req, res) {
    try {
        const usuarios = await UsuarioService.consultarUsuarios(req.usuario);
        res.json(usuarios);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}

module.exports = {crearUsuario, actualizarUsuario, eliminarUsuario, cambiarEstadoUsuario, listarUsuarios};
