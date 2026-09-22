const Permiso = require('../models/Permiso');

class PermisoService {
    static async obtenerTodos() {
        return await Permiso.obtenerTodos();
    }
}

module.exports = PermisoService;