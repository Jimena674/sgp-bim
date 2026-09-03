import api from './api';

export const registrarRol = (datos) => api.post('/roles', datos);
export const consultarRoles = () => api.get('/roles');
export const actualizarRol = (id, datos) => api.put(`/roles/${id}`, datos);
export const eliminarRol = (id) => api.delete(`/roles/${id}`);