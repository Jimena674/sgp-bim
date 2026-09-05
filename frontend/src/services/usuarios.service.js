import api from './api';

export const crearUsuario = (datos) => api.post('/usuarios', datos);
export const actualizarUsuario = (id, datos) => api.put(`/usuarios/${id}`, datos);
export const listarUsuarios = (filtros) => api.get('/usuarios', {params: filtros});
export const cambiarEstadoUsuario = (id, codigo_estado) => api.patch(`/usuarios/${id}/estado`, {codigo_estado});