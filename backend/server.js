require('dotenv').config();

const express = require('express');
const pool = require('./src/config/db');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const rolRoutes = require('./src/routes/rolRoutes');
const sesionRoutes = require('./src/routes/sesionRoutes');
const permisoRoutes = require('./src/routes/permisoRoutes');
const cors = require('cors');
const tipoRoutes = require('./src/routes/tipoRoutes');
const moduloRoutes = require('./src/routes/moduloRoutes');
const actividadRoutes = require('./src/routes/actividadRoutes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/auth', sesionRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/modulos', moduloRoutes);
app.use('/api/actividades', actividadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});