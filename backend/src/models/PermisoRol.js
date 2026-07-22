const pool = require ('../config/db');

class PermisoRol {

    static async asignarPermiso (id_rol, id_permiso, asignado_por) {
        await pool.query('INSERT INTO permisos_roles (id_permiso, id_rol, fecha_asignacion, asignado_por) VALUES (?, ?, NOW(), ?)', [id_permiso, id_rol, asignado_por]);
    }

    static async obtenerPermisosPorRol (id_rol) {
        const [filas] = await pool.query(
            `SELECT pr.id_permiso_rol, p.nombre_permiso FROM permisos_roles pr INNER JOIN permisos p ON p.id_permiso = pr.id_permiso WHERE pr.id_rol = ?`, [id_rol]
        );
        return filas;
    }

    static async historialPermisos (id_rol) {
        const [filas] = await pool.query('SELECT pr.id_permiso_rol, pr.id_permiso, pr.fecha_asignacion, pr.asignado_por, u.nombre_usuario, p.nombre_permiso FROM permisos_roles pr INNER JOIN usuarios u ON u.id_usuario = pr.asignado_por INNER JOIN permisos p ON p.id_permiso = pr.id_permiso WHERE pr.id_rol = ? ORDER BY pr.fecha_asignacion DESC', [id_rol]);
        return filas;
    }

    static async eliminarPermiso (id_permiso_rol) {
        await pool.query('DELETE FROM permisos_roles WHERE id_permiso_rol = ?', [id_permiso_rol]);
    }

};

module.exports = PermisoRol;