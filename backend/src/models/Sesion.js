const pool = require('../config/db');
const { ejecutarConsultaPaginada } = require('../utils/consultaPaginada');

class Sesion {

    static async crearSesion(datosSesion){
        const {id_usuario, id_estado, log_in, ip_origen, jwt_id} = datosSesion;
        const [resultado] = await pool.query('INSERT INTO sesiones (id_usuario, id_estado, log_in, fecha_ultima_actividad, ip_origen, jwt_id) VALUES (?, ?, NOW(), NOW(), ?, ?)', [id_usuario, id_estado, ip_origen, jwt_id]);  
        return resultado.insertId;
    }

    static async cerrarSesion(id_sesion, id_estado){
        const [resultado] = await pool.query('UPDATE sesiones SET id_estado = ?, log_out = NOW() WHERE id_sesion = ?', [id_estado, id_sesion]);
        return resultado.affectedRows > 0;
    }

    static async buscarActivaPorJti(jwt_id, id_estado_activa){
        const [filas] = await pool.query('SELECT * FROM sesiones WHERE jwt_id = ? AND id_estado = ?', [jwt_id, id_estado_activa]);
        return filas[0];
    }

    static async buscarActivaPorUsuario(id_usuario, id_estado_activa){
        const [filas] = await pool.query('SELECT * FROM sesiones WHERE id_usuario = ? AND id_estado = ?', [id_usuario, id_estado_activa]);
        return filas[0];
    }

    static async actualizarUltimaActividad(id_sesion){
        await pool.query('UPDATE sesiones SET fecha_ultima_actividad = NOW() WHERE id_sesion = ?', [id_sesion]);
    }

    static async consultarHistorialSesiones({id_usuario, desde, hasta, tamano, offset}){

        let condiciones = 'WHERE 1=1';
        const params = [];

        if (id_usuario) {condiciones += ' AND s.id_usuario = ?'; params.push(id_usuario);}
        if (desde) {condiciones += ' AND s.log_in >= ?'; params.push(desde);}
        if (hasta) {condiciones += ' AND s.log_in <= ?'; params.push(hasta);}

        const queryDatos = `
            SELECT s.*, e.codigo_estado, e.nombre_estado, u.nombre_usuario
            FROM sesiones s
            LEFT JOIN estados e ON e.id_estado = s.id_estado
            LEFT JOIN usuarios u ON u.id_usuario = s.id_usuario
            ${condiciones}
            ORDER BY s.log_in DESC
            LIMIT ? OFFSET ?
        `;

        const queryConteo = `SELECT COUNT(*) AS total FROM sesiones s ${condiciones}`;

        return ejecutarConsultaPaginada(pool, queryDatos, queryConteo, params, tamano, offset);
    }

};

module.exports = Sesion;