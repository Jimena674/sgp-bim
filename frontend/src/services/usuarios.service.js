import api from './api';

export const crearUsuario = (datos) => api.post('/usuarios', datos);
export const actualizarUsuario = (id, datos) => api.put(`/usuarios/${id}`, datos);
export const listarUsuarios = (params) => api.get('/usuarios', {params});
export const cambiarEstadoUsuario = (id, codigo_estado) => api.patch(`/usuarios/${id}/estado`, {codigo_estado});
export const asignarRol = (id_usuario, codigo_rol) => api.post('/usuarios/asignar-rol', {id_usuario, codigo_rol});
export const revocarRol = (id_usuario, codigo_rol) => api.put('/usuarios/revocar-rol', {id_usuario, codigo_rol});