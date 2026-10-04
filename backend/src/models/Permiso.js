const pool = require('../config/db');

class Permiso {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            `SELECT p.*, m.nombre_modulo, m.codigo_modulo
            FROM permisos p
            INNER JOIN modulos m ON m.id_modulo = p.id_modulo
            ORDER BY m.id_modulo, p.nombre_permiso`
        );
        return filas;
    }

    static async obtenerPorCodigo(codigo_permiso) {
        const [filas] = await pool.query('SELECT * FROM permisos WHERE codigo_permiso = ?', [codigo_permiso]);
        return filas[0];
    }
    
}

module.exports = Permiso;