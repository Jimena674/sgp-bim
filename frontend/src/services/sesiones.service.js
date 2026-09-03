import api from './api';

export const login = (numero_id, password) => api.post('/login', {numero_id, password});
export const logout = () => api.patch('/logout');
export const consultarHistorial = (filtros) => api.get('/', {params:filtros});