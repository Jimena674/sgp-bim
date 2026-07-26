const Usuario = require('../models/Usuario');
const EstadoUsuario = require('../models/EstadoUsuario');
const bcrypt = require('bcrypt');
const {validarIdentificacion, validarUnicidad} = require('../utils/validadores');

const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2;
const ROLES_CONSULTA_TOTAL = ['Administrador', 'Coordinador'];

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
        validarUnicidad(correoExistente, 'correo');

        //Regla: identificación única
        const numeroIdExistente = await Usuario.obtenerPorNumeroId(numero_id);
        validarUnicidad(numeroIdExistente, 'numero_id');

        //Regla: contraseña se almacena cifrada
        const passwordCifrada = await bcrypt.hash(password, 10);

        //Regla: al crear, pasa automáticamente a estado activo
        // y se registra fecha de creación y responsable
        const nuevoUsuario = await Usuario.crear({
            ...datosUsuario,
            password: passwordCifrada,
            registro_por: idResponsable,
            fecha_registro: new Date()
        });

        await EstadoUsuario.cambioEstado(nuevoUsuario, ESTADO_ACTIVO, idResponsable);

        return nuevoUsuario;
    }

    static async actualizarUsuario(id, datosUsuario) {
        const usuario = await Usuario.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado.');

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

    static async eliminarUsuario(id) {
        const usuario = await Usuario.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado.');

        //Falta validar que el usuario no esté asociado a actividades
        
        await Usuario.eliminar(id)
    }

    static async cambiarEstadoUsuario(id, id_estado, idResponsable) {
        const usuario = await Usuario.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado.');

        if(![ESTADO_ACTIVO, ESTADO_INACTIVO].includes(id_estado)) {
            throw new Error('Estado inválido. Solo se permiten los estados activo e inactivo.');
        }

        await EstadoUsuario.asignarEstado(id, id_estado, idResponsable);
    }

    static async consultarUsuarios(usuarioSolicitante) {
        const {id: idSolicitante, rol: rolSolicitante} = usuarioSolicitante;

        if (ROLES_CONSULTA_TOTAL.includes(rolSolicitante)) {
            return await Usuario.obtenerTodos();
        }

        const usuarioPropio = await Usuario.obtenerPorId(idSolicitante);
        return usuarioPropio ? [usuarioPropio] : [];
    }
}

module.exports = UsuarioService;