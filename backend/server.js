require('dotenv').config();

const express = require('express');
const pool = require('./src/config/db');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const rolRoutes = require('./src/routes/rolRoutes');
const sesionRoutes = require('./src/routes/sesionRoutes');
const permisoRoutes = require('./src/routes/permisoRoutes');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const app = express();

app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/auth', sesionRoutes);
app.use('/api/permisos', permisoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});