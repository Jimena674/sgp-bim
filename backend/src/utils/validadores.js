function validarIdentificacion(numero_id) {
    const regex = /^[0-9a-zA-Z]{1,20}$/;
    return regex.test(numero_id);
}

function validarUnicidad(registroExistente, campo) {
    if(registroExistente) {
        throw new Error(`Ya existe un registro con este valor: ${campo}`);
    }
}

module.exports = { validarIdentificacion, validarUnicidad };