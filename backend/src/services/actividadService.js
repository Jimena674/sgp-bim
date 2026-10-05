const Actividad = require('../models/Actividad');
const { ErrorConEstado } = require('../utils/errores');
const { normalizarPaginacion, respuestaPaginada } = require('../utils/paginacion');

const LONGITUD_MAXIMA_NOMBRE = 100;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/;
const ESTADO_CONFLICTO = 409;
const ESTADO_NO_ENCONTRADO = 404;

// ─── VALIDACIONES ───

function normalizarNombre(nombre) {
    return typeof nombre === 'string' ? nombre.trim().replace(/\s+/g, ' ') : '';
}

/** @throws {Error} Si el nombre falta, contiene caracteres no textuales o excede la longitud. */
function validarNombre(nombre) {
    if (!nombre) {
        throw new Error('El nombre de la actividad es obligatorio.');
    }
    if (!REGEX_NOMBRE.test(nombre) || nombre.length > LONGITUD_MAXIMA_NOMBRE) {
        throw new Error(`El nombre solo puede contener letras y máximo ${LONGITUD_MAXIMA_NOMBRE} caracteres.`);
    }
}

/** @throws {Error} Si el identificador no es un entero positivo. */
function validarId(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error('El identificador de la actividad no es válido.');
    }
}

async function validarSinAsociaciones(id, accion) {
    if (await Actividad.contarAsociaciones(id) > 0) {
        throw new ErrorConEstado(
            `No se puede ${accion} la actividad porque está asociada a plantillas o proyectos.`, ESTADO_CONFLICTO
        );
    }
}

async function obtenerActivaOFallar(id) {
    validarId(id);
    const actividad = await Actividad.obtenerActivaPorId(id);
    if (!actividad) {
        throw new ErrorConEstado('Actividad no encontrada.', ESTADO_NO_ENCONTRADO);
    }
    return actividad;
}

async function validarNombreDisponible(nombre, idExcluido = null) {
    const existente = await Actividad.obtenerActivaPorNombre(nombre);
    if (existente && existente.id_actividad !== idExcluido) {
        throw new ErrorConEstado('Ya existe una actividad con ese nombre.', ESTADO_CONFLICTO);
    }
}

function traducirErrorDuplicado(error) {
    if (error.code === 'ER_DUP_ENTRY') {
        return new ErrorConEstado('Ya existe una actividad con ese nombre.', ESTADO_CONFLICTO);
    }
    return error;
}

class ActividadService {

    /**
     * @param {{nombre_actividad_catalogo: string}} datos
     * @param {number} idResponsable - Usuario autenticado que crea la actividad.
     * @returns {Promise<number>} Identificador de la actividad creada.
     */
    static async registrarActividad(datos, idResponsable) {
        const nombre = normalizarNombre(datos.nombre_actividad_catalogo);
        validarNombre(nombre);
        await validarNombreDisponible(nombre);

        try {
            return await Actividad.registrar(nombre, idResponsable);
        } catch (error) {
            throw traducirErrorDuplicado(error);
        }
    }

    /**
     * @param {number|string} id
     * @param {{nombre_actividad_catalogo: string}} datos
     * @param {number} idResponsable
     * @throws {ErrorConEstado} 404 si no existe; 409 si está asociada o el nombre está repetido.
     */
    static async actualizarActividad(id, datos, idResponsable) {
        await obtenerActivaOFallar(id);
        await validarSinAsociaciones(id, 'modificar');

        const nombre = normalizarNombre(datos.nombre_actividad_catalogo);
        validarNombre(nombre);
        await validarNombreDisponible(nombre, Number(id));

        try {
            await Actividad.actualizar(id, nombre, idResponsable);
        } catch (error) {
            throw traducirErrorDuplicado(error);
        }
    }

    /**
     * Baja lógica de la actividad.
     * @throws {ErrorConEstado} 404 si no existe; 409 si está asociada a plantillas o proyectos.
     */
    static async eliminarActividad(id, idResponsable) {
        await obtenerActivaOFallar(id);
        await validarSinAsociaciones(id, 'eliminar');
        await Actividad.eliminar(id, idResponsable);
    }

    /** @returns {Promise<{datos: object[], paginacion: object}>} */
    static async consultarActividades(filtros = {}) {
        const { pagina, tamano, offset } = normalizarPaginacion(filtros.pagina, filtros.tamano);
        const busqueda = typeof filtros.busqueda === 'string' ? filtros.busqueda.trim() : '';
        const { filas, total } = await Actividad.obtenerTodosPaginado(tamano, offset, busqueda);
        return respuestaPaginada(filas, total, pagina, tamano);
    }
}

module.exports = ActividadService;