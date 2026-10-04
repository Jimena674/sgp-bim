import { useState, useEffect, useCallback } from 'react';
import { consultarAsignacionesPermisos } from '../services/roles.service';
import { useEstadoPeticion } from './useEstadoPeticion';

export function useAsignacionesPermisos() {
    const [asignaciones, setAsignaciones] = useState([]);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargar = useCallback(async () => {
        try {
            const { data } = await ejecutar(() => consultarAsignacionesPermisos());
            setAsignaciones(data);
        } catch {
            console.error('Error al cargar las asignaciones de permisos.');
        }
    }, [ejecutar]);

    useEffect(() => { cargar(); }, [cargar]);

    return { asignaciones, cargando, error, recargar: cargar };
}