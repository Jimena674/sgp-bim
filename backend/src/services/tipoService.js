const Tipo = require('../models/Tipo');
const Modulo = require('../models/Modulo');
const {validarUnicidad} = require('../utils/validadores');
const {ErrorConEstado} = require('../utils/errores');

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/;
const REGEX_CODIGO = /^[A-Z]{1,10}$/;

class TipoService {

    static async registrarTipo(datosTipo) {
        const {id_modulo, nombre_tipo, codigo_tipo} = datosTipo;

        if (!id_modulo || !nombre_tipo || !codigo_tipo) {
            throw new Error('El módulo, nombre y código del tipo son datos obligatorios.');
        }
        if (!REGEX_NOMBRE.test(nombre_tipo)) {
            throw new Error('El nombre solo puede contener letras y máximo 60 caracteres.');
        }
        if (!REGEX_CODIGO.test(codigo_tipo)) {
            throw new Error('El código solo puede contener letras mayúsculas y máximo 10 caracteres.');
        }

        const modulo = await Modulo.obtenerPorId(id_modulo);
        if (!modulo) throw new ErrorConEstado('Módulo no encontrado.', 404);

        const codigoExistente = await Tipo.obtenerPorCodigo(codigo_tipo, modulo.codigo_modulo);
        validarUnicidad(codigoExistente, codigo_tipo);

        return await Tipo.registrar(datosTipo);
    }

    static async actualizarTipo(id, datosTipo) {
        const tipo = await Tipo.obtenerPorId(id);
        if (!tipo) throw new ErrorConEstado('Tipo no encontrado.', 404);

        // id_modulo deliberadamente no editable: ver observaciones críticas.
        const camposPermitidos = ['nombre_tipo', 'codigo_tipo'];
        const datosLimpios = {};
        for (const campo of camposPermitidos) {
            if (datosTipo[campo] !== undefined) datosLimpios[campo] = datosTipo[campo];
        }
        const {nombre_tipo, codigo_tipo} = datosLimpios;

        if (nombre_tipo && !REGEX_NOMBRE.test(nombre_tipo)) {
            throw new Error('El nombre solo puede contener letras y máximo 60 caracteres.');
        }
        if (codigo_tipo && !REGEX_CODIGO.test(codigo_tipo)) {
            throw new Error('El código solo puede contener letras mayúsculas y máximo 10 caracteres.');
        }

        if (codigo_tipo) {
            const modulo = await Modulo.obtenerPorId(tipo.id_modulo);
            const existe = await Tipo.obtenerPorCodigo(codigo_tipo, modulo.codigo_modulo);
            if (existe && existe.id_tipo !== Number(id)) {
                throw new Error('Ya existe un tipo con ese código en este módulo.');
            }
        }

        await Tipo.actualizar(id, datosLimpios);
    }

    static async eliminarTipo(id) {
        const tipo = await Tipo.obtenerPorId(id);
        if (!tipo) throw new ErrorConEstado('Tipo no encontrado.', 404);

        const totalUsuarios = await Tipo.contarUsuariosAsociados(id);
        if (totalUsuarios > 0) {
            throw new ErrorConEstado('No se puede eliminar el tipo porque está asignado a usuarios.', 409);
        }

        await Tipo.eliminar(id);
    }

    static async consultarTodos() {
        return await Tipo.obtenerTodos();
    }

    static async consultarPorModulo(codigo_modulo) {
        if (!codigo_modulo) throw new Error('El código del módulo es obligatorio.');
        return await Tipo.obtenerPorModulo(codigo_modulo);
    }
}

module.exports = TipoService;