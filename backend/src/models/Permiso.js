const pool = require('../config/db');

class Permiso {

    static async obtenerTodos() {
        const [filas] = await pool.query('SELECT * FROM permisos ORDER BY nombre_permiso');
        return filas;
    }

    static async obtenerPorCodigo(codigo_permiso) {
        const [filas] = await pool.query('SELECT * FROM permisos WHERE codigo_permiso = ?', [codigo_permiso]);
        return filas[0];
    }
    
}

module.exports = Permiso;