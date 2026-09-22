const UsuarioService = require('../services/usuarioService');

async function crearUsuario(req, res) {
    try {
        const idNuevoUsuario = await UsuarioService.registrarUsuario(req.body, req.usuario.id);
        res.status(201).json({mensaje:'Usuario creado exitosamente', id: idNuevoUsuario});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function actualizarUsuario(req, res) {
    try {
        await UsuarioService.actualizarUsuario(req.params.id, req.body);
        res.json({mensaje: 'Usuario actualizado exitosamente'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
    
}

async function cambiarEstadoUsuario (req, res) {
    try {
        await UsuarioService.cambiarEstadoUsuario(req.params.id, req.body.codigo_estado, req.usuario.id);
        res.json({mensaje: 'Estado del usuario actualizado exitosamente'});
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function listarUsuarios (req, res) {
    try {
        const {pagina, tamano, busqueda} = req.query;
        const usuarios = await UsuarioService.consultarUsuarios(req.usuario, {pagina, tamano, busqueda});
        res.json(usuarios);
    } catch (error) {
        res.status(error.estado || 400).json({ error: error.message});
    }
}

async function asignarRol(req, res) {
    try{
        const idAsignacion = await UsuarioService.asignarRol(req.body.id_usuario, req.body.codigo_rol, req.usuario.id);
        res.status(201).json({mensaje:'Rol asignado exitosamente.', id:idAsignacion})
    } catch(error){
        res.status(error.estado || 400).json({error: error.message});
    }
}

async function revocarRol(req, res) {
    try {
        await UsuarioService.revocarRol(req.body.id_usuario, req.body.codigo_rol, req.usuario.id);
        res.status(200).json({mensaje:'Rol revocado de manera exitosa.'})
    } catch (error) {
        res.status(error.estado || 400).json({error: error.message});
    }
}

module.exports = {crearUsuario, actualizarUsuario, cambiarEstadoUsuario, listarUsuarios, asignarRol, revocarRol};
