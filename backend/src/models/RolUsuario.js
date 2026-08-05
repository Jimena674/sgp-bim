const pool = require('../config/db');

class RolUsuario {

    static async obtenerRolActual(id_usuario){
        const[filas] = await pool.query('SELECT ru.*, r.codigo_rol, r.nombre_rol FROM roles_usuarios ru INNER JOIN roles r ON r.id_rol = ru.id_rol WHERE ru.id_usuario = ? ORDER BY ru.fecha_asignacion DESC LIMIT 1', [id_usuario]);
        return filas[0];
    }

    static async asignarRol(id_usuario, id_rol, asignado_por) {
        await pool.query(
            'INSERT INTO roles_usuarios (id_rol, id_usuario, fecha_asignacion, asignado_por) VALUES (?, ?, NOW()),  ?', [id_rol, id_usuario, asignado_por]
        );
    }
}

module.exports = RolUsuario;