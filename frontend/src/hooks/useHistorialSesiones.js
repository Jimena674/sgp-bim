import { useState, useEffect, useCallback } from 'react';
import { consultarHistorial } from '../services/sesiones_service';
import { useEstadoPeticion } from './useEstadoPeticion';

const TAMANO_DEFECTO = 10;

export function useHistorialSesiones(filtrosIniciales = {}) {
    const [sesiones, setSesiones] = useState([]);
    const [paginacion, setPaginacion] = useState({ pagina: 1, tamano: TAMANO_DEFECTO, total: 0, total_paginas: 0 });
    const [filtros, setFiltros] = useState(filtrosIniciales);
    const [pagina, setPagina] = useState(1);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarHistorial = useCallback(async () => {
        const { data } = await ejecutar(() =>
            consultarHistorial({ ...filtros, pagina, tamano: TAMANO_DEFECTO })
        );
        setSesiones(data.datos);
        setPaginacion(data.paginacion);
    }, [ejecutar, filtros, pagina]);

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    const aplicarFiltros = useCallback((nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagina(1);
    }, []);

    const irAPagina = useCallback((nuevaPagina) => {
        setPagina(nuevaPagina);
    }, []);

    return {
        sesiones,
        paginacion,
        pagina,
        cargando,
        error,
        aplicarFiltros,
        irAPagina,
        recargar: cargarHistorial,
    };
}