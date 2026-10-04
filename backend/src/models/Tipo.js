const pool = require('../config/db');

class Tipo {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT t.*, m.codigo_modulo, m.nombre_modulo
             FROM tipos t INNER JOIN modulos m ON m.id_modulo = t.id_modulo
             ORDER BY m.nombre_modulo, t.nombre_tipo`
        );
        return filas;
    }

    static async obtenerPorModulo(codigo_modulo) {
        const [filas] = await pool.query(
            `SELECT t.* FROM tipos t INNER JOIN modulos m ON m.id_modulo = t.id_modulo
             WHERE m.codigo_modulo = ? ORDER BY t.nombre_tipo`, [codigo_modulo]
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query('SELECT * FROM tipos WHERE id_tipo = ?', [id]);
        return filas[0];
    }

    static async obtenerPorCodigo(codigo_tipo, codigo_modulo) {
        const [filas] = await pool.query(
            `SELECT t.* FROM tipos t INNER JOIN modulos m ON m.id_modulo = t.id_modulo
             WHERE t.codigo_tipo = ? AND m.codigo_modulo = ?`, [codigo_tipo, codigo_modulo]
        );
        return filas[0];
    }

    static async registrar(datosTipo) {
        const {id_modulo, nombre_tipo, codigo_tipo} = datosTipo;
        const [resultado] = await pool.query(
            'INSERT INTO tipos (id_modulo, nombre_tipo, codigo_tipo) VALUES (?, ?, ?)',
            [id_modulo, nombre_tipo, codigo_tipo]
        );
        return resultado.insertId;
    }

    static async actualizar(id, datosTipo) {
        const campos = Object.keys(datosTipo);
        if (campos.length === 0) return;
        const asignaciones = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = campos.map(campo => datosTipo[campo]);
        await pool.query(`UPDATE tipos SET ${asignaciones} WHERE id_tipo = ?`, [...valores, id]);
    }

    static async contarUsuariosAsociados(id) {
        const [filas] = await pool.query('SELECT COUNT(*) AS total FROM usuarios WHERE id_tipo = ?', [id]);
        return filas[0].total;
    }

    static async eliminar(id) {
        await pool.query('DELETE FROM tipos WHERE id_tipo = ?', [id]);
    }
}

module.exports = Tipo;