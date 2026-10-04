import { useState, useEffect, useCallback } from 'react';
import { consultarModulos } from '../services/modulos.service';
import { useEstadoPeticion } from './useEstadoPeticion';

export function useModulos() {
    const [modulos, setModulos] = useState([]);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarModulos = useCallback(async () => {
        try {
            const { data } = await ejecutar(() => consultarModulos());
            setModulos(data);
        } catch {
            console.error('Error al cargar los módulos.');
        }
    }, [ejecutar]);

    useEffect(() => { cargarModulos(); }, [cargarModulos]);

    return { modulos, cargando, error };
}