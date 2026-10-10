import { useState, useEffect, useCallback } from 'react';
import {
    consultarActividades,
    registrarActividad,
    actualizarActividad,
    eliminarActividad,
} from '../services/actividades.service';
import { useEstadoPeticion } from './useEstadoPeticion';

const TAMANO_DEFECTO = 10;

export function useActividades() {
    const [actividades, setActividades] = useState([]);
    const [paginacion, setPaginacion] = useState({ pagina: 1, tamano: TAMANO_DEFECTO, total: 0, total_paginas: 0 });
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina] = useState(1);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarActividades = useCallback(async () => {
        try {
            const { data } = await ejecutar(() =>
                consultarActividades({ busqueda, pagina, tamano: TAMANO_DEFECTO })
            );
            
            if (data.datos.length === 0 && pagina > 1 && data.paginacion.total_paginas > 0) {
                setPagina(data.paginacion.total_paginas);
                return;
            }
            setActividades(data.datos);
            setPaginacion(data.paginacion);
        } catch {
            console.error('Error al cargar las actividades.');
        }
    }, [ejecutar, busqueda, pagina]);

    useEffect(() => {
        cargarActividades();
    }, [cargarActividades]);

    const buscar = useCallback((texto) => {
        setBusqueda(texto);
        setPagina(1);
    }, []);

    const irAPagina = useCallback((nuevaPagina) => {
        setPagina(nuevaPagina);
    }, []);

    const crear = useCallback(async (datos) => {
        const resultado = await ejecutar(() => registrarActividad(datos));
        await cargarActividades();
        return resultado.data;
    }, [ejecutar, cargarActividades]);

    const actualizar = useCallback(async (id, datos) => {
        const resultado = await ejecutar(() => actualizarActividad(id, datos));
        await cargarActividades();
        return resultado.data;
    }, [ejecutar, cargarActividades]);

    const eliminar = useCallback(async (id) => {
        const resultado = await ejecutar(() => eliminarActividad(id));
        await cargarActividades();
        return resultado.data;
    }, [ejecutar, cargarActividades]);

    return { actividades, paginacion, pagina, cargando, error, buscar, irAPagina, crear, actualizar, eliminar };
}