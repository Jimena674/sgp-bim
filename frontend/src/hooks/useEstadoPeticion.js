import { useState, useCallback } from 'react';

export function useEstadoPeticion() {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const ejecutar = useCallback(async (peticion) => {
        setCargando(true);
        setError(null);
        try {
            return await peticion();
        } catch (err) {
            const mensaje = err.response?.data?.error || 'Ocurrió un error inesperado.';
            setError(mensaje);
            throw err;
        } finally {
            setCargando(false);
        }
    }, []);

    return { cargando, error, ejecutar };
}