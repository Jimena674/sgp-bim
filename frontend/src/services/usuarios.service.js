import api from './api';

export const crearUsuario = (datos) => api.post('/usuarios', datos);
export const actualizarUsuario = (id, datos) => api.put(`/usuarios/${id}`, datos);
export const listarUsuarios = (params) => api.get('/usuarios', {params});
export const cambiarEstadoUsuario = (id, codigo_estado) => api.patch(`/usuarios/${id}/estado`, {codigo_estado});