const pool = require('../config/db');
const { ejecutarConsultaPaginada } = require('../utils/consultaPaginada');

class Usuario {

    //Obtener todos los usuarios
    static async obtenerTodos() {
        const [filas] = await pool.query('SELECT * FROM usuarios');
        return filas;
    }

    static async obtenerTodosPaginado(tamano, offset, busqueda) {

        const condiciones = busqueda
            ? 'WHERE u.nombre_usuario LIKE ? OR u.correo LIKE ?'
            : '';
        const params = busqueda ? [`%${busqueda}%`, `%${busqueda}%`] : [];

        const queryDatos = `
            SELECT 
                u.*,
                e.codigo_estado, e.nombre_estado,
                r.codigo_rol, r.nombre_rol, r.bg_color
            FROM usuarios u
            LEFT JOIN (
                SELECT eu1.id_usuario, eu1.id_estado
                FROM estados_usuarios eu1
                INNER JOIN (
                    SELECT id_usuario, MAX(fecha_asignacion) AS ultima_fecha
                    FROM estados_usuarios
                    GROUP BY id_usuario
                ) eu2 ON eu1.id_usuario = eu2.id_usuario AND eu1.fecha_asignacion = eu2.ultima_fecha
            ) estado_actual ON estado_actual.id_usuario = u.id_usuario
            LEFT JOIN estados e ON e.id_estado = estado_actual.id_estado
            LEFT JOIN (
                SELECT ru1.id_usuario, ru1.id_rol
                FROM roles_usuarios ru1
                INNER JOIN (
                    SELECT id_usuario, MAX(fecha_asignacion) AS ultima_fecha
                    FROM roles_usuarios
                    WHERE activo = TRUE
                    GROUP BY id_usuario
                ) ru2 ON ru1.id_usuario = ru2.id_usuario AND ru1.fecha_asignacion = ru2.ultima_fecha
                WHERE ru1.activo = TRUE
            ) rol_actual ON rol_actual.id_usuario = u.id_usuario
            LEFT JOIN roles r ON r.id_rol = rol_actual.id_rol
            ${condiciones}
            ORDER BY u.id_usuario
            LIMIT ? OFFSET ?
        `;

        const queryConteo = `SELECT COUNT(*) AS total FROM usuarios u ${condiciones}`;

        return ejecutarConsultaPaginada(pool, queryDatos, queryConteo, params, tamano, offset); 
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

    static async registrarIntentoFallido(id_usuario, intentos_fallidos){
        const [resultado] = await pool.query('UPDATE usuarios SET intentos_fallidos = ?, fecha_ultimo_intento = NOW() WHERE id_usuario = ?', [intentos_fallidos, id_usuario]);
        return resultado.affectedRows > 0;
    }

    static async reiniciarIntentosFallidos(id_usuario){
        const [resultado] = await pool.query('UPDATE usuarios SET intentos_fallidos = 0 WHERE id_usuario = ?', [id_usuario]);
        return resultado.affectedRows > 0;
    }
}
module.exports=Usuario;