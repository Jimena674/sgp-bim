const pool = require('../config/db');

class RolUsuario {

    static async obtenerRolActual(id_usuario){
        const[filas] = await pool.query('SELECT ru.*, r.codigo_rol, r.nombre_rol FROM roles_usuarios ru INNER JOIN roles r ON r.id_rol = ru.id_rol WHERE ru.id_usuario = ? AND ru.activo = TRUE ORDER BY ru.fecha_asignacion DESC LIMIT 1', [id_usuario]);
        return filas[0];
    }

    static async asignarRol(id_usuario, id_rol, asignado_por) {
        const conexion = await pool.getConnection();
        try {
            await conexion.beginTransaction();

            await conexion.query(
                'UPDATE roles_usuarios SET activo = FALSE, fecha_revocado = NOW(), revocado_por = ? WHERE id_usuario = ? AND activo = TRUE',
                [asignado_por, id_usuario]
            );

            const [resultado] = await conexion.query(
                'INSERT INTO roles_usuarios (id_rol, id_usuario, fecha_asignacion, asignado_por, activo) VALUES (?, ?, NOW(), ?, TRUE)',
                [id_rol, id_usuario, asignado_por]
            );

            await conexion.commit();
            return resultado.insertId;
        } catch (error) {
            await conexion.rollback();
            throw error;
        } finally {
            conexion.release();
        }
    }

    static async revocarRol(id_usuario, id_rol, revocado_por){
        const [resultado] = await pool.query(
            'UPDATE roles_usuarios SET activo = FALSE, fecha_revocado = NOW(), revocado_por = ? WHERE id_usuario = ? AND id_rol = ? AND activo = TRUE', [revocado_por, id_usuario, id_rol]
        );
        return resultado.affectedRows > 0;
    }

    static async tieneRolActivo(id_usuario, id_rol) {
        const [filas] = await pool.query('SELECT id_rol_usuario FROM roles_usuarios WHERE id_usuario = ? AND id_rol = ? AND activo = TRUE', [id_usuario, id_rol]);
        return filas.length > 0;
    }
}

module.exports = RolUsuario;