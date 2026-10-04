import { useState, useEffect, useCallback } from 'react';
import { consultarTiposPorModulo } from '../services/tipos.service';
import { useEstadoPeticion } from './useEstadoPeticion';

export function useTiposPorModulo(codigo_modulo) {
    const [tipos, setTipos] = useState([]);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarTipos = useCallback(async () => {
        try {
            const { data } = await ejecutar(() => consultarTiposPorModulo(codigo_modulo));
            setTipos(data);
        } catch {
            console.error('Error al cargar los tipos.');
        }
    }, [ejecutar, codigo_modulo]);

    useEffect(() => {
        if (codigo_modulo) cargarTipos();
    }, [cargarTipos, codigo_modulo]);

    return { tipos, cargando, error };
}