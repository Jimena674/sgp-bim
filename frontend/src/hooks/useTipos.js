import { useState, useEffect, useCallback } from 'react';
import { consultarTodosTipos, registrarTipo, actualizarTipo, eliminarTipo } from '../services/tipos.service';
import { useEstadoPeticion } from './useEstadoPeticion';

export function useTipos() {
    const [tipos, setTipos] = useState([]);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarTipos = useCallback(async () => {
        try {
            const { data } = await ejecutar(() => consultarTodosTipos());
            setTipos(data);
        } catch {
            console.error('Error al cargar los tipos.');
        }
    }, [ejecutar]);

    useEffect(() => { cargarTipos(); }, [cargarTipos]);

    const crear = useCallback(async (datos) => {
        const resultado = await ejecutar(() => registrarTipo(datos));
        await cargarTipos();
        return resultado.data;
    }, [ejecutar, cargarTipos]);

    const actualizar = useCallback(async (id, datos) => {
        const resultado = await ejecutar(() => actualizarTipo(id, datos));
        await cargarTipos();
        return resultado.data;
    }, [ejecutar, cargarTipos]);

    const eliminar = useCallback(async (id) => {
        const resultado = await ejecutar(() => eliminarTipo(id));
        await cargarTipos();
        return resultado.data;
    }, [ejecutar, cargarTipos]);

    return { tipos, cargando, error, crear, actualizar, eliminar, recargar: cargarTipos };
}