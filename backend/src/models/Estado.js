const pool = require('../config/db');

class Estado {

    static async obtenerPorCodigo(codigo_estado, codigo_modulo) {
        const[filas] = await pool.query(
            'SELECT e.* FROM estados e INNER JOIN modulos m ON m.id_modulo = e.id_modulo WHERE e.codigo_estado = ? AND m.codigo_modulo = ?', [codigo_estado, codigo_modulo]
        );
        return filas[0];
    }
}

module.exports = Estado;