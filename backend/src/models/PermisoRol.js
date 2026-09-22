const pool = require ('../config/db');

class PermisoRol {

    static async asignarPermiso (id_rol, id_permiso, asignado_por) {
        const [resultado] = await pool.query('INSERT INTO permisos_roles (id_permiso, id_rol, fecha_asignacion, asignado_por, activo) VALUES (?, ?, NOW(), ?, TRUE)', [id_permiso, id_rol, asignado_por]);
        return resultado.insertId;
    }

    static async obtenerAsignacionActiva (id_rol, id_permiso){
        const [filas] = await pool.query(
            'SELECT id_permiso_rol FROM permisos_roles WHERE id_rol= ? AND id_permiso = ? AND activo = 1', [id_rol, id_permiso]
        );
        return filas[0];
    }

    static async obtenerPermisosPorRol (id_rol) {
        const [filas] = await pool.query(
            `SELECT pr.id_permiso_rol, p.nombre_permiso FROM permisos_roles pr INNER JOIN permisos p ON p.id_permiso = pr.id_permiso WHERE pr.id_rol = ? AND pr.activo = 1`, [id_rol]
        );
        return filas;
    }

    static async historialPermisos (id_rol) {
        const [filas] = await pool.query('SELECT pr.id_permiso_rol, pr.id_permiso, pr.fecha_asignacion, pr.asignado_por, u.nombre_usuario, p.nombre_permiso FROM permisos_roles pr INNER JOIN usuarios u ON u.id_usuario = pr.asignado_por INNER JOIN permisos p ON p.id_permiso = pr.id_permiso WHERE pr.id_rol = ? ORDER BY pr.fecha_asignacion DESC', [id_rol]);
        return filas;
    }

    static async tienePermiso(id_rol, codigo_permiso) {
        const[filas]= await pool.query(
            'SELECT pr.id_permiso_rol FROM permisos_roles pr INNER JOIN permisos p ON p.id_permiso = pr.id_permiso WHERE pr.id_rol = ? AND p.codigo_permiso = ? AND pr.activo = 1', [id_rol, codigo_permiso]
        );
        return filas.length > 0;
    }

    static async revocarPermiso(id_permiso_rol, revocado_por) {
        const [resultado] = await pool.query('UPDATE permisos_roles SET activo = 0, fecha_revocado = NOW(), revocado_por = ? WHERE id_permiso_rol = ? AND activo = 1', [revocado_por, id_permiso_rol]
        );
        return resultado.affectedRows > 0;
    }
    
};

module.exports = PermisoRol;