const jwt = require('jsonwebtoken');
const Sesion = require('../models/Sesion');
const Estado = require('../models/Estado');
const {COD_MOD_SESIONES} = require('../utils/constantesModulos');
const {EST_SESION_ACTIVA, EST_SESION_CERRADA_TIMEOUT} = require('../utils/constantesEstados');


async function verificarSesion(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({error:'Token no proporcionado.'});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const sesionActiva = await Estado.obtenerPorCodigo(EST_SESION_ACTIVA, COD_MOD_SESIONES);
        const sesion = await Sesion.buscarActivaPorJti(payload.jti, sesionActiva.id_estado);
        if (!sesion) {
            return res.status(401).json({error: 'Sesión inválida o cerrada.'});
        }

        const minutosInactiva = (Date.now() - new Date(sesion.fecha_ultima_actividad)) / 60000;
        if (minutosInactiva > 20) {
            const estadoTimeout = await Estado.obtenerPorCodigo(EST_SESION_CERRADA_TIMEOUT, COD_MOD_SESIONES)
            await Sesion.cerrarSesion(sesion.id_sesion, estadoTimeout.id_estado);
            return res.status(401).json({error: 'Sesión cerrada por inactividad.'});
        }

        await Sesion.actualizarUltimaActividad(sesion.id_sesion);

        req.usuario = payload;
        req.id_sesion = sesion.id_sesion;
        next();
    } catch (error) {
        return res.status(401).json({error:'Token inválido o expirado.'});
    }
}

module.exports = verificarSesion;