const Rol = require('../models/Rol');
const PermisoRol = require('../models/PermisoRol');
const RolUsuario = require('../models/RolUsuario');
const {validarUnicidad} = require('../utils/validadores');
const {ErrorConEstado} = require('../utils/errores');
const Permiso = require('../models/Permiso');

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,40}$/;
const REGEX_CODIGO = /^[a-z]{1,40}$/;
const PERMISO_CONSULTAR_TODOS = 'consultar_roles';
const REGEX_COLOR_HEX = /^#[0-9A-Fa-f]{6}$/;

class RolService {

    static async registrarRol (datosRol) {
        const {nombre_rol, codigo_rol, descripcion_rol} = datosRol

        if (!nombre_rol || !codigo_rol) {
            throw new Error('El nombre y código del rol son datos obligatorios.');
        }

        if (!REGEX_NOMBRE.test(nombre_rol)) {
            throw new Error('El nombre solo puede contener letras y máximo 40 caracteres.');
        }

        if (!REGEX_CODIGO.test(codigo_rol)) {
            throw new Error('El código solo puede contener letras minúsculas y máximo 40 caracteres. No se permite tildes o ñ.');
        }

        if(datosRol.bg_color && !REGEX_COLOR_HEX.test(datosRol.bg_color)) {
            throw new Error('El color debe estar en formato hexadecimal, ejemplo: #1B364E.');
        }

        const nombreExistente = await Rol.obtenerPorNombre(nombre_rol);
        validarUnicidad(nombreExistente, nombre_rol);

        const codigoExistente = await Rol.obtenerPorCodigo(codigo_rol);
        validarUnicidad(codigoExistente, codigo_rol);

        const nuevoRol = await Rol.registrar(datosRol);
        return nuevoRol;
    }

    static async actualizarRol (id, datosRol) {

        //Validar que existe el rol
        const rol = await Rol.obtenerPorId(id);
        if (!rol) throw new ErrorConEstado('Rol no encontrado.', 404);
        
        //Limpiar los campos que se pueden actualizar
        const camposPermitidos = ['nombre_rol', 'codigo_rol', 'descripcion_rol', 'bg_color'];
        const datosLimpios = {};
        for (const campo of camposPermitidos) {
            if (datosRol[campo] !== undefined) {
                datosLimpios[campo] = datosRol[campo]
            }
        }
        const {nombre_rol, codigo_rol, descripcion_rol} = datosLimpios;
        
        //Validaciones
        if(nombre_rol && !REGEX_NOMBRE.test(nombre_rol)) {
            throw new Error('El nombre solo puede contener letras y máximo 40 caracteres.');
        }

        if(codigo_rol && !REGEX_CODIGO.test(codigo_rol)) {
            throw new Error('El código solo puede contener letras minúsculas y máximo 40 caracteres. No se permite tíldes o "ñ".');
        }

        if(nombre_rol) {
            const existe = await Rol.obtenerPorNombre(nombre_rol);
            if (existe && existe.id_rol !== id) {
                throw new Error('Ya existe un rol con ese nombre.');
            }
        }
        
        if(codigo_rol) {
            const existe = await Rol.obtenerPorCodigo(codigo_rol);
            if(existe && existe.id_rol !== id) {
                throw new Error('Ya existe un rol con ese código.');
            }
        }

        //Si pasa las validaciones
        await Rol.actualizar(id, datosLimpios);
    }

    static async eliminarRol (id) {
        const rol = await Rol.obtenerPorId(id);
        if (!rol) throw new Error('Rol no encontrado.', 404);

        const totalUsuarios = await Rol.contarUsuariosAsociados(id);
        if (totalUsuarios > 0) {
            throw new ErrorConEstado('No se puede eliminar el rol porque tiene usuarios asociados.', 409);
        }

        await Rol.eliminar(id);
    }

    static async consultarRoles (usuarioSolicitante) {
        const {id: idSolicitante} = usuarioSolicitante;

        const rolActual = await RolUsuario.obtenerRolActual(idSolicitante);
        if(!rolActual) return [];

        const puedeConsultarTodos = await PermisoRol.tienePermiso(rolActual.id_rol, PERMISO_CONSULTAR_TODOS);
        if(puedeConsultarTodos) {
            return await Rol.obtenerTodos();
        }

        const rolPropio = await Rol.obtenerPorId(rolActual.id_rol);
        if (!rolPropio) return [];
        return [{
            nombre_rol: rolPropio.nombre_rol,
            descripcion_rol: rolPropio.descripcion_rol
        }];
    }

    static async asignarPermiso (codigo_rol, codigo_permiso, asignado_por) {

        if(!codigo_rol || !codigo_permiso) {
            throw new Error('El código del permiso y el código del rol son obligatorios.');
        }

        const rol = await Rol.obtenerPorCodigo(codigo_rol);
        if(!rol) throw new ErrorConEstado('Rol no encontrado.', 404);

        const permiso = await Permiso.obtenerPorCodigo(codigo_permiso);
        if(!permiso) throw new ErrorConEstado('Permiso no encontrado.', 404);

        const yaAsignado = await PermisoRol.tienePermiso(rol.id_rol, codigo_permiso);
        if(yaAsignado) {
            throw new ErrorConEstado('El rol ya tiene ese permiso asignado.', 409);
        }

        return await PermisoRol.asignarPermiso(rol.id_rol, permiso.id_permiso, asignado_por);
    }

    static async revocarPermiso (codigo_rol, codigo_permiso, revocado_por) {

        if(!codigo_rol || !codigo_permiso) {
            throw new Error('El código del permiso y el código del rol son obligatorios.');
        }

        const rol = await Rol.obtenerPorCodigo(codigo_rol);
        if(!rol) throw new ErrorConEstado('Rol no encontrado.', 404);

        const permiso = await Permiso.obtenerPorCodigo(codigo_permiso);
        if(!permiso) throw new ErrorConEstado('Permiso no encontrado.', 404);

        const asignacionActiva = await PermisoRol.obtenerAsignacionActiva(rol.id_rol, permiso.id_permiso);
        if(!asignacionActiva) {
            throw new ErrorConEstado('El rol ya tiene el permiso revocado.', 409);
        }

        return await PermisoRol.revocarPermiso(asignacionActiva.id_permiso_rol, revocado_por);

    }

    static async obtenerPermisosDeRol(id_rol) {
        const rol = await Rol.obtenerPorId(id_rol);
        if (!rol) throw new ErrorConEstado('Rol no encontrado.', 404);

        return await PermisoRol.obtenerPermisosPorRol(id_rol);
    }

}

module.exports = RolService;