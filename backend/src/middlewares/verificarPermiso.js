const PermisoRol = require("../models/PermisoRol");

function verificarPermiso(codigo_permiso) {
    return async (req, res, next) => {

        if (!req.usuario || !req.usuario.id_rol) {
            return res.status(401).json({error: 'Usuario no autenticado.'});
        }
        const autorizado = await PermisoRol.tienePermiso(req.usuario.id_rol, codigo_permiso);
        if(!autorizado) {
            return res.status(403).json({error: "No tienes permiso para realizar esta acción"})
        }
        next();
    };        
}

module.exports = verificarPermiso;
