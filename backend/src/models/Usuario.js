const pool = require('../config/db');

class Usuario {

    //Obtener todos los usuarios
    static async obtenerTodos() {
        const [filas] = await pool.query('SELECT * FROM usuarios');
        return filas;
    }

    //Obtener por id
    static async obtenerPorId(id) {
        const [filas] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        return filas[0];
    }

    //Crear un nuevo usuario
    static async crear(datosUsuario) {
        const {nombre_usuario, id_tipo, numero_id, correo, telefono, password}= datosUsuario;
        const [resultado] = await pool.query('INSERT INTO usuarios(nombre_usuario, id_tipo, numero_id, correo, telefono, password) VALUES (?, ?, ?, ?, ?, ?)', [nombre_usuario, id_tipo, numero_id, correo, telefono, password]);
        return resultado.insertId;
    }

    //Actualizar un usuario
    static async actualizar(id, datosUsuario) {
        const campos = Object.keys(datosUsuario);
        if (campos.length === 0) return;

        const asignaciones = campos.map(campo => `${campo} = ?`).join(', ');
        const valores = campos.map(campo => datosUsuario[campo]);

        await pool.query(`UPDATE usuarios SET ${asignaciones} WHERE id_usuario = ?`, [...valores, id]);
    }

    //Eliminar un usuario
    static async eliminar(id) {
        await pool.query('DELETE FROM usuarios WHERE id_usuario=?', [id]);
    }

    //Obtener un usuario por su correo
    static async obtenerPorCorreo(correo) {
        const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return filas[0];
    }

    //Obtener un usuario por su número de identificación
    static async obtenerPorNumeroId(numero_id) {
        const [filas] = await pool.query('SELECT * FROM usuarios WHERE numero_id = ?', [numero_id]);
        return filas[0];
    }
}
module.exports=Usuario;