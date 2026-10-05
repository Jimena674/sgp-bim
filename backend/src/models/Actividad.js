const pool = require('../config/db');
const { ejecutarConsultaPaginada } = require('../utils/consultaPaginada');

const TABLAS_ASOCIADAS = [];

class Actividad {

    static async obtenerTodosPaginado(tamano, offset, busqueda) {
        const condiciones = busqueda ? 'AND a.nombre_actividad_catalogo LIKE ?' : '';
        // Se escapan los comodines de LIKE para que la búsqueda sea literal.
        const params = busqueda ? [`%${busqueda.replace(/[\\%_]/g, '\\$&')}%`] : [];

        const queryDatos = `
            SELECT a.id_actividad, a.nombre_actividad_catalogo, a.creado_por,
                   a.fecha_registro, a.fecha_actualizacion, u.nombre_usuario AS nombre_creador
            FROM actividades_catalogo a
            INNER JOIN usuarios u ON u.id_usuario = a.creado_por
            WHERE a.activo = 1 ${condiciones}
            ORDER BY a.nombre_actividad_catalogo
            LIMIT ? OFFSET ?
        `;
        const queryConteo = `SELECT COUNT(*) AS total FROM actividades_catalogo a WHERE a.activo = 1 ${condiciones}`;

        return ejecutarConsultaPaginada(pool, queryDatos, queryConteo, params, tamano, offset);
    }

    static async obtenerActivaPorId(id) {
        const [filas] = await pool.query(
            'SELECT * FROM actividades_catalogo WHERE id_actividad = ? AND activo = 1', [id]
        );
        return filas[0];
    }

    static async obtenerActivaPorNombre(nombre) {
        const [filas] = await pool.query(
            'SELECT * FROM actividades_catalogo WHERE nombre_actividad_catalogo = ? AND activo = 1', [nombre]
        );
        return filas[0];
    }

    static async registrar(nombre, creado_por) {
        const [resultado] = await pool.query(
            'INSERT INTO actividades_catalogo (nombre_actividad_catalogo, creado_por) VALUES (?, ?)',
            [nombre, creado_por]
        );
        return resultado.insertId;
    }

    static async actualizar(id, nombre, modificado_por) {
        const [resultado] = await pool.query(
            `UPDATE actividades_catalogo
             SET nombre_actividad_catalogo = ?, fecha_actualizacion = NOW(), modificado_por = ?
             WHERE id_actividad = ? AND activo = 1`,
            [nombre, modificado_por, id]
        );
        return resultado.affectedRows > 0;
    }

    // Baja lógica: conserva el registro y registra quién y cuándo lo eliminó.
    static async eliminar(id, eliminado_por) {
        const [resultado] = await pool.query(
            `UPDATE actividades_catalogo
             SET activo = 0, fecha_eliminacion = NOW(), eliminado_por = ?
             WHERE id_actividad = ? AND activo = 1`,
            [eliminado_por, id]
        );
        return resultado.affectedRows > 0;
    }

    static async contarAsociaciones(id) {
        let total = 0;
        for (const { tabla, columna } of TABLAS_ASOCIADAS) {
            const [filas] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla} WHERE ${columna} = ?`, [id]);
            total += filas[0].total;
        }
        return total;
    }
}

module.exports = Actividad;