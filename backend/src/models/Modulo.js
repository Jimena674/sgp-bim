const pool = require('../config/db');

class Modulo {

    static async obtenerPorCodigo(codigo_modulo){
        const[filas] = await pool.query(
            'SELECT * FROM modulos WHERE codigo_modulo = ?', [codigo_modulo]
        );
        return filas[0];
    }

    static async obtenerTodos() {
    const [filas] = await pool.query('SELECT * FROM modulos ORDER BY nombre_modulo');
    return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query('SELECT * FROM modulos WHERE id_modulo = ?', [id]);
        return filas[0];
    }
    
}

module.exports = Modulo;