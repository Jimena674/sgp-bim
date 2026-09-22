import { useState, useEffect, useCallback } from 'react';
import { consultarPermisos } from '../services/permisos.service';
import { useEstadoPeticion } from './useEstadoPeticion';

export function usePermisos() {
    const [permisos, setPermisos] = useState([]);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarPermisos = useCallback(async () => {
        try {
            const { data } = await ejecutar(() => consultarPermisos());
            setPermisos(data);
        } catch {
            console.error('Error al cargar los permisos.');
        }
    }, [ejecutar]);

    useEffect(() => {
        cargarPermisos();
    }, [cargarPermisos]);

    return { permisos, cargando, error };
}