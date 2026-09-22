const pool = require('../config/db');
class Rol {

    static async obtenerTodos () {
        const [filas] = await pool.query('SELECT * FROM roles');
        return filas;
    }

    static async obtenerPorNombre (nombre) {
        const [filas] = await pool.query('SELECT * FROM roles WHERE nombre_rol = ?', [nombre]);
        return filas[0];
    }

    static async obtenerPorCodigo (codigo) {
        const [filas] = await pool.query('SELECT * FROM roles WHERE codigo_rol = ?', [codigo]);
        return filas[0];
    }

    static async obtenerPorId (id) {
        const [filas] = await pool.query('SELECT * FROM roles WHERE id_rol = ?', [id]);
        return filas[0];
    }

    static async registrar (datosRol) {
        const {nombre_rol, codigo_rol, descripcion_rol, bg_color} = datosRol;
        const [resultado] = await pool.query('INSERT INTO roles (nombre_rol, codigo_rol, descripcion_rol, bg_color) VALUES (?, ?, ?, ?)', [nombre_rol, codigo_rol, descripcion_rol, bg_color ?? null]);
        return resultado.insertId;
    }

    static async actualizar (id, datosRol) {
        const campos = Object.keys(datosRol);
        if (campos.length === 0) return;

        const asignaciones = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = campos.map(campo => datosRol[campo]);

        await pool.query(`UPDATE roles SET ${asignaciones} WHERE id_rol = ?`, [...valores, id]);
    }

    static async eliminar (id) {
        await pool.query('DELETE FROM roles WHERE id_rol = ?', [id]);
    }

    static async contarUsuariosAsociados (id) {
        const [filas] = await pool.query('SELECT COUNT(*) AS total FROM roles_usuarios WHERE id_rol = ?', [id]);
        return filas[0].total;
    }

};

module.exports = Rol;