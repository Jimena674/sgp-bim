const Modulo = require('../models/Modulo');

class ModuloService {
    static async consultarTodos() {
        return await Modulo.obtenerTodos();
    }
}

module.exports = ModuloService;