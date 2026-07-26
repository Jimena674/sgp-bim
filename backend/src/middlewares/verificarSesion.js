const jwt = require('jsonwebtoken');

function verificarSesion(req, res, next) {
    const token = req.headers.authorization?.split('')[1];

    if(!token){
        return res.status(401).json({error:'Token no proporcionado.'});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({error:'Token inválido o expirado.'});
    }
}

module.exports = verificarSesion;