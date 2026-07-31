require('dotenv').config();

const express = require('express');
const pool = require('./src/config/db');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const rolRoutes = require('./src/routes/rolRoutes');

const app = express();

app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/roles', rolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});