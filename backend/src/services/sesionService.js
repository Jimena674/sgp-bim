const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Sesion = require('../models/Sesion');
const Usuario = require('../models/Usuario');
const RolUsuario = require('../models/RolUsuario');
const EstadoUsuario = require('../models/EstadoUsuario');
const Estado = require('../models/Estado');
const errores = require('../utils/errores');
const {normalizarPaginacion, respuestaPaginada} = require('../utils/paginacion');
const {COD_MOD_SESIONES, COD_MOD_USUARIOS} = require('../utils/constantesModulos');
const {EST_USUARIO_ACTIVO, EST_USUARIO_INACTIVO, EST_SESION_ACTIVA, EST_SESION_CERRADA_MANUAL, EST_SESION_CERRADA_FORZADA} = require('../utils/constantesEstados');

const MAX_INT_FALLIDOS = 3;

class SesionService {

    static async login(numero_id, password, ip_origen){

         const usuario = await Usuario.obtenerPorNumeroId(numero_id);
         if(!usuario){
            throw new errores.ErrorConEstado('El usuario no existe.', 401);
         }

         const estadoActual = await EstadoUsuario.estadoActual(usuario.id_usuario);
         if(estadoActual.codigo_estado !== EST_USUARIO_ACTIVO) {
            throw new errores.ErrorConEstado('Usuario inactivo.',403);
         }

         const passwordValido = await bcrypt.compare(password, usuario.password);
         if(!passwordValido) {
            const intentos = usuario.intentos_fallidos + 1;
            await Usuario.registrarIntentoFallido(usuario.id_usuario, intentos);

            if(intentos >= MAX_INT_FALLIDOS) {
                const usuarioInactivo = await Estado.obtenerPorCodigo(EST_USUARIO_INACTIVO, COD_MOD_USUARIOS);
                await EstadoUsuario.asignarEstado(usuario.id_usuario, usuarioInactivo.id_estado, null);
                await Usuario.reiniciarIntentosFallidos(usuario.id_usuario);
                throw new errores.ErrorConEstado('Usuario bloqueado por múltiples intentos fallidos.', 403);
            }

            throw new errores.ErrorConEstado('Contraseña inválida.', 401);
         }

         const rol = await RolUsuario.obtenerRolActual(usuario.id_usuario);
         if(!rol) {
            throw new errores.ErrorConEstado('Un usuario sin rol asignado no puede iniciar sesión.', 403);
         }

         await Usuario.reiniciarIntentosFallidos(usuario.id_usuario);
         
         const sesionActiva = await Estado.obtenerPorCodigo(EST_SESION_ACTIVA, COD_MOD_SESIONES);

         const sesionExistente = await Sesion.buscarActivaPorUsuario(usuario.id_usuario, sesionActiva.id_estado);
         if (sesionExistente) {
            const sesionCerradaForzada = await Estado.obtenerPorCodigo(EST_SESION_CERRADA_FORZADA, COD_MOD_SESIONES);
            await Sesion.cerrarSesion(sesionExistente.id_sesion, sesionCerradaForzada.id_estado);
         }

         const jti = crypto.randomUUID();

         const token = jwt.sign(
            {id: usuario.id_usuario, id_rol: rol.id_rol}, process.env.JWT_SECRET, {expiresIn: '8h', jwtid: jti}
         );

         const id_sesion = await Sesion.crearSesion({
            id_usuario: usuario.id_usuario,
            id_estado: sesionActiva.id_estado,
            ip_origen,
            jwt_id: jti
         });

         return {token, id_sesion, nombre_usuario: usuario.nombre_usuario};

    }

    static async logout(id_sesion){
        const sesionCerradaManual = await Estado.obtenerPorCodigo(EST_SESION_CERRADA_MANUAL, COD_MOD_SESIONES);
        const cerrada = await Sesion.cerrarSesion(id_sesion, sesionCerradaManual.id_estado);
        if(!cerrada) {
            throw new errores.ErrorConEstado('Sesión no encontrada.', 404);
        }
        return true;
    }
    
    static async consultarHistorial(filtros) {
         const {pagina, tamano, offset} = normalizarPaginacion(filtros.pagina, filtros.tamano);
         const {filas, total} =await Sesion.consultarHistorialSesiones({...filtros, tamano, offset});
         return respuestaPaginada(filas, total, pagina, tamano);

    }
};

module.exports = SesionService;