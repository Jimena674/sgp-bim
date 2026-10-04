const pool = require('../config/db');

class EstadoUsuario {
    //Obtener el historial de estados de un usuario
    static async historialEstados(id_usuario) {
        const [filas] = await pool.query('SELECT * FROM estados_usuarios WHERE id_usuario = ? ORDER BY fecha_asignacion DESC', [id_usuario]);
        return filas;
    }

    //Obtener el último estado de un usuario
    static async estadoActual(id_usuario) {
        const [filas] = await pool.query(
            'SELECT eu.*, e.codigo_estado, e.nombre_estado FROM estados_usuarios eu JOIN estados e ON eu.id_estado = e.id_estado WHERE eu.id_usuario = ? ORDER BY eu.fecha_asignacion DESC LIMIT 1', 
            [id_usuario]
        );
        return filas[0];
    }

    //Registrar el cambio de estado
    static async asignarEstado(id_usuario, id_estado, asignado_por) {
        await pool.query('INSERT INTO estados_usuarios (id_estado, id_usuario, fecha_asignacion, asignado_por) VALUES (?, ?, NOW(), ?)', [id_estado, id_usuario, asignado_por]);
    }
};

module.exports = EstadoUsuario;