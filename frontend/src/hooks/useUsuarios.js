import { useState, useEffect, useCallback } from 'react';
import { useEstadoPeticion } from './useEstadoPeticion';
import {
    crearUsuario,
    actualizarUsuario,
    listarUsuarios,
    cambiarEstadoUsuario,
    asignarRol,
    revocarRol,
} from '../services/usuarios.service.js';

const TAMANO_DEFECTO = 10;

export function useUsuarios(filtrosIniciales = {}) {
    const [usuarios, setUsuarios] = useState([]);
    const [paginacion, setPaginacion] = useState({ pagina: 1, tamano: TAMANO_DEFECTO, total: 0, total_paginas: 0 });
    const [filtros, setFiltros] = useState(filtrosIniciales);
    const [pagina, setPagina] = useState(1);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarUsuarios = useCallback(async () => {
        try {
            const { data } = await ejecutar(() => 
            listarUsuarios({...filtros, pagina, tamano: TAMANO_DEFECTO}));
        setUsuarios(data.datos);
        setPaginacion(data.paginacion);
        } catch {
            console.error('Error al cargar los usuarios.');
        }
        
    }, [ejecutar, filtros, pagina]);

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]);

     const aplicarFiltros = useCallback((nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagina(1);
    }, []);

    const irAPagina = useCallback((nuevaPagina) => {
        setPagina(nuevaPagina);
    }, []);

    const crear = useCallback(async (datos) => {
        const resultado = await ejecutar(() => crearUsuario(datos));
        await cargarUsuarios();
        return resultado.data;
    }, [ejecutar, cargarUsuarios]);

    const actualizar = useCallback(async (id, datos) => {
        const resultado = await ejecutar(() => actualizarUsuario(id, datos));
        await cargarUsuarios();
        return resultado.data;
    }, [ejecutar, cargarUsuarios]);

    const cambiarEstado = useCallback(async (id, codigo_estado) => {
        const resultado = await ejecutar(() => cambiarEstadoUsuario(id, codigo_estado));
        await cargarUsuarios();
        return resultado.data;
    }, [ejecutar, cargarUsuarios]);

    const asignarRolUsuario = useCallback(async (id_usuario, codigo_rol) => {
        const resultado = await ejecutar(() => asignarRol(id_usuario, codigo_rol));
        await cargarUsuarios();
        return resultado.data;
    }, [ejecutar, cargarUsuarios]);

    const revocarRolUsuario = useCallback(async (id_usuario, codigo_rol) => {
        const resultado = await ejecutar(() => revocarRol(id_usuario, codigo_rol));
        await cargarUsuarios();
        return resultado.data;
    }, [ejecutar, cargarUsuarios]);

    return { usuarios, paginacion, pagina, cargando, error, aplicarFiltros, irAPagina, crear, actualizar, cambiarEstado, asignarRolUsuario, revocarRolUsuario, recargar: cargarUsuarios };
}

