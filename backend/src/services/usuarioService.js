const Usuario = require('../models/Usuario');
const EstadoUsuario = require('../models/EstadoUsuario');
const Estado = require('../models/Estado');
const RolUsuario = require('../models/RolUsuario');
const PermisoRol = require('../models/PermisoRol');
const bcrypt = require('bcrypt');
const {validarIdentificacion, validarUnicidad} = require('../utils/validadores');

const CODIGO_ESTADO_ACTIVO = 'ACT';
const CODIGO_ESTADO_INACTIVO = 'INA';
const PERMISO_CONSULTAR_TODOS = 'consultar_usuarios';
const CODIGO_MODULO_USUARIOS = 'usuarios';

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

class UsuarioService {

    static async registrarUsuario(datosUsuario, idResponsable) {
        const {
            nombre_usuario,
            id_tipo,
            numero_id,
            correo,
            telefono,
            password
        } = datosUsuario;

        //Regla: campos obligatorios
        if (!nombre_usuario || !id_tipo || !numero_id || !correo || !password) {
            throw new Error('El nombre, tipo de identificación, número de identificación, correo y contraseña son datos obligatorios.');
        }

        //Regla: nombre solo texto, máximo 40 caracteres
        if (!REGEX_NOMBRE.test(nombre_usuario)) {
            throw new Error('El nombre solo puede contener letras y máximo 40 caracteres.');
        }

        //Regla: # identificación solo números y letras, y máximo 20 caracteres
        if(!validarIdentificacion(numero_id)) {
            throw new Error('El número de identificación solo puede contener letras y números, y máximo 20 caracteres.');
        }

        //Regla: contraseña(mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial)
        if(!REGEX_PASSWORD.test(password)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
        }

        //Regla: correo único
        const correoExistente = await Usuario.obtenerPorCorreo(correo);
        validarUnicidad(correoExistente, correo);

        //Regla: identificación única
        const numeroIdExistente = await Usuario.obtenerPorNumeroId(numero_id);
        validarUnicidad(numeroIdExistente, numero_id);

        //Regla: contraseña se almacena cifrada
        const passwordCifrada = await bcrypt.hash(password, 10);

        //Regla: al crear, pasa automáticamente a estado activo
        // y se registra fecha de creación y responsable
        const nuevoUsuario = await Usuario.crear({
            ...datosUsuario,
            password: passwordCifrada
        });

        const estadoActivo = await Estado.obtenerPorCodigo(CODIGO_ESTADO_ACTIVO, CODIGO_MODULO_USUARIOS);
        await EstadoUsuario.asignarEstado(nuevoUsuario, estadoActivo.id_estado, idResponsable);

        return nuevoUsuario;
    }

    static async actualizarUsuario(id, datosUsuario) {
        const usuario = await Usuario.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado.', 404);

        //filtrar solo los campos permitidos
        const camposPermitidos = ['nombre_usuario', 'id_tipo', 'numero_id', 'correo', 'telefono', 'password'];
        const datosLimpios = {};

        for (const campo of camposPermitidos) {
            if (datosUsuario[campo] !== undefined) {
                datosLimpios[campo] = datosUsuario[campo]
            }
        }
        const {nombre_usuario, id_tipo, numero_id, correo, telefono, password} = datosLimpios;

        //validaciones

        if(nombre_usuario && !REGEX_NOMBRE.test(nombre_usuario)) {
            throw new Error ('El nombre solo puede contener letras y máximo 40 caracteres.');
        }

        if(numero_id) {
            if(!validarIdentificacion(numero_id)) {
                throw new Error('El número de identificación solo puede contener letras y números, y máximo 20 caracteres.');
            }
            if (numero_id !== usuario.numero_id) {
                validarUnicidad(await Usuario.obtenerPorNumeroId(id), 'numero_id');
            }
        }

        if(correo && correo !== usuario.correo) {
            validarUnicidad(await Usuario.obtenerPorCorreo(correo), 'correo');
        }

        //validar contraseña y encriptarla
         if(password) {
            if(!REGEX_PASSWORD.test(password)) {
                throw new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
            }
            datosLimpios. password = await bcrypt.hash(password, 10);
         }

         //Si toda la validación pasá, se llama al model
         await Usuario.actualizar(id, datosLimpios);
    }

    static async cambiarEstadoUsuario(id, codigo_estado, idResponsable) {
        const usuario = await Usuario.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado.', 404);

        if(![CODIGO_ESTADO_ACTIVO, CODIGO_ESTADO_INACTIVO].includes(codigo_estado)) {
            throw new Error('Estado inválido. Solo se permiten los estados activo e inactivo.');
        }

        const estado = await Estado.obtenerPorCodigo(codigo_estado, CODIGO_MODULO_USUARIOS);
        await EstadoUsuario.asignarEstado(id, estado.id_estado, idResponsable); 
    }

    static async consultarUsuarios(usuarioSolicitante) {
        const {id: idSolicitante} = usuarioSolicitante;

        const rolActual = await RolUsuario.obtenerRolActual(idSolicitante);
        if(!rolActual) return [];

        const puedeConsultarTodos = await PermisoRol.tienePermiso(rolActual.id_rol, PERMISO_CONSULTAR_TODOS);
        if(puedeConsultarTodos) {
            return await Usuario.obtenerTodos();
        }

        const usuarioPropio = await Usuario.obtenerPorId(idSolicitante);
        return usuarioPropio ? [usuarioPropio] : [];
    }
}

module.exports = UsuarioService;