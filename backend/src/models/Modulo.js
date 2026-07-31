const pool = require('../config/db');

class Modulo {
    static async obtenerPorCodigo(codigo_modulo){
        const[filas] = await pool.query(
            'SELECT * FROM modulos WHERE codigo_modulo = ?', [codigo_modulo]
        );
        return filas[0];
    }
}

module.exports = Modulo;