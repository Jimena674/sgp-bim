const express = require('express');
const app = express();
const PUERTO = 3000;
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

const usuarioRoutes = require('./src/routes/usuarioRoutes');
app.use('/usuarios', usuarioRoutes);