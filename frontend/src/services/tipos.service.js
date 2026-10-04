import api from './api';

export const consultarTiposPorModulo = (codigo_modulo) => api.get('/tipos', {params: {codigo_modulo}});
export const consultarTodosTipos = () => api.get('/tipos/todos');
export const registrarTipo = (datos) => api.post('/tipos', datos);
export const actualizarTipo = (id, datos) => api.put(`/tipos/${id}`, datos);
export const eliminarTipo = (id) => api.delete(`/tipos/${id}`);