const TAMANO_DEFECTO = 10;
const TAMANO_MAXIMO = 20;

function normalizarPaginacion(pagina, tamano) {

    const paginaNormalizada = Number(pagina) > 0 ? Math.floor(Number(pagina)) : 1;
    const tamanoNormalizado = Number(tamano) > 0
        ? Math.min(Math.floor(Number(tamano)), TAMANO_MAXIMO)
        : TAMANO_DEFECTO;
    const offset = (paginaNormalizada - 1) * tamanoNormalizado;
    return {pagina: paginaNormalizada, tamano: tamanoNormalizado, offset};
}

function respuestaPaginada(filas, total, pagina, tamano) {
    return {
        datos:filas, 
        paginacion: {pagina, tamano, total, total_paginas: Math.ceil(total/tamano)}
    };
}

module.exports = {normalizarPaginacion, respuestaPaginada};
