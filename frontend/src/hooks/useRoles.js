import { useState, useEffect, useCallback } from 'react';
import { registrarRol, consultarRoles, actualizarRol, eliminarRol } from '../services/roles_service';
import { useEstadoPeticion } from './useEstadoPeticion';

export function useRoles() {
    const [roles, setRoles] = useState([]);
    const { cargando, error, ejecutar } = useEstadoPeticion();

    const cargarRoles = useCallback(async () => {
        const { data } = await ejecutar(() => consultarRoles());
        setRoles(data);
    }, [ejecutar]);

    useEffect(() => {
        cargarRoles();
    }, [cargarRoles]);

    const crear = useCallback(async (datos) => {
        const resultado = await ejecutar(() => registrarRol(datos));
        await cargarRoles();
        return resultado.data;
    }, [ejecutar, cargarRoles]);

    const actualizar = useCallback(async (id, datos) => {
        const resultado = await ejecutar(() => actualizarRol(id, datos));
        await cargarRoles();
        return resultado.data;
    }, [ejecutar, cargarRoles]);

    const eliminar = useCallback(async (id) => {
        const resultado = await ejecutar(() => eliminarRol(id));
        await cargarRoles();
        return resultado.data;
    }, [ejecutar, cargarRoles]);

    return { roles, cargando, error, crear, actualizar, eliminar, recargar: cargarRoles };
}