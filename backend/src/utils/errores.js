class ErrorConEstado extends Error {
    constructor(mensaje, estado) {
        super(mensaje);
        this.estado = estado;
    }
}

module.exports = {ErrorConEstado};