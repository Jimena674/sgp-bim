import api from './api';

export const consultarActividades = (params) => api.get('/actividades', {params});
export const registrarActividad = (datos) => api.post('/actividades', datos);
export const actualizarActividad = (id, datos) => api.put(`/actividades/${id}`, datos);
export const eliminarActividad = (id) => api.delete(`/actividades/${id}`);