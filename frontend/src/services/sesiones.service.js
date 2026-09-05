import api from './api';

export const login = (numero_id, password) => api.post('/auth/login', {numero_id, password});
export const logout = () => api.patch('/auth/logout');
export const consultarHistorial = (filtros) => api.get('/auth', {params:filtros});