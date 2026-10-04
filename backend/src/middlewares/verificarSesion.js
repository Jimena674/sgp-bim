const jwt = require('jsonwebtoken');
const Sesion = require('../models/Sesion');
const Estado = require('../models/Estado');
const {COD_MOD_SESIONES} = require('../utils/constantesModulos');
const {
    EST_SESION_ACTIVA,
    EST_SESION_CERRADA_MANUAL,
    EST_SESION_CERRADA_TIMEOUT,
    EST_SESION_CERRADA_FORZADA
} = require('../utils/constantesEstados');

const MINUTOS_INACTIVIDAD = 20;

const MENSAJES_CIERRE = {
    [EST_SESION_CERRADA_FORZADA]: 'Tu sesión fue cerrada porque se inició sesión con este usuario en otro dispositivo.',
    [EST_SESION_CERRADA_TIMEOUT]: 'Tu sesión fue cerrada por inactividad.',
    [EST_SESION_CERRADA_MANUAL]: 'La sesión fue cerrada.'
};

function crearVerificador({ registrarActividad }) {
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({error: 'Token no proporcionado.'});
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            const sesion = await Sesion.buscarPorJti(payload.jti);
            if (!sesion) {
                return res.status(401).json({error: 'Sesión inválida.'});
            }

            if (sesion.codigo_estado !== EST_SESION_ACTIVA) {
                return res.status(401).json({
                    error: MENSAJES_CIERRE[sesion.codigo_estado] ?? 'Sesión inválida o cerrada.'
                });
            }

            const minutosInactiva = (Date.now() - new Date(sesion.fecha_ultima_actividad)) / 60000;
            if (minutosInactiva > MINUTOS_INACTIVIDAD) {
                const estadoTimeout = await Estado.obtenerPorCodigo(EST_SESION_CERRADA_TIMEOUT, COD_MOD_SESIONES);
                await Sesion.cerrarSesion(sesion.id_sesion, estadoTimeout.id_estado);
                return res.status(401).json({error: MENSAJES_CIERRE[EST_SESION_CERRADA_TIMEOUT]});
            }

            if (registrarActividad) {
                await Sesion.actualizarUltimaActividad(sesion.id_sesion);
            }

            req.usuario = payload;
            req.id_sesion = sesion.id_sesion;
            next();
        } catch (error) {
            return res.status(401).json({error: 'Token inválido o expirado.'});
        }
    };
}

module.exports = crearVerificador({ registrarActividad: true });
module.exports.pasiva = crearVerificador({ registrarActividad: false });