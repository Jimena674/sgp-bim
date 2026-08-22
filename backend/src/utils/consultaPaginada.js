async function ejecutarConsultaPaginada(pool, queryDatos, queryConteo, params, tamano, offset) {

    const [filas] = await pool.query(queryDatos, [...params, tamano, offset]);
    const [[{total}]] = await pool.query(queryConteo, params);
    return {filas, total};

}

module.exports = {ejecutarConsultaPaginada};