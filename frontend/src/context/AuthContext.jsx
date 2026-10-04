import { createContext, useState, useContext, useEffect } from "react";
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const nombre_usuario = localStorage.getItem('nombre_usuario');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUsuario({id: payload.id, id_rol: payload.id_rol, nombre_usuario});
        }
        setCargando(false);
    }, []);

    useEffect(() => {
        if (!usuario) return;

        // El 401 lo gestiona el interceptor de api.js (guarda el mensaje y redirige).
        const verificar = () => { api.get('/auth/sesion').catch(() => {}); };

        const intervalo = setInterval(verificar, 10000);
        window.addEventListener('focus', verificar);

        return () => {
            clearInterval(intervalo);
            window.removeEventListener('focus', verificar);
        };
    }, [usuario]);

    const login = async (numero_id, password) => {
        const {data} = await api.post('/auth/login', {
            numero_id, password
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('nombre_usuario', data.nombre_usuario);

        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUsuario({
            id: payload.id, 
            id_rol: payload.id_rol,
            nombre_usuario: data.nombre_usuario
        });
    };

    const logout = async () => {
        await api.patch('/auth/logout');
        localStorage.removeItem('token');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);