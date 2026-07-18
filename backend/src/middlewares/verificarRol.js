function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.rol) {
            return res.status(401).json({error: 'Usuario no autenticado'});
        }
        if(!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ error: 'No tienes permiso para realiza esta acción.'})
        }
        
        next();
    };
}

module.exports = verificarRol;
