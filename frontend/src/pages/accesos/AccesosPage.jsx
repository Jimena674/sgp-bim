import { useState } from 'react';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { EstadoBadge } from '../../components/common/EstadoBadge/EstadoBadge';
import { useHistorialSesiones } from '../../hooks/useHistorialSesiones';

function AccesosPage() {
  const { sesiones, paginacion, pagina, cargando, error, aplicarFiltros, irAPagina } = useHistorialSesiones();

  const [filtros, setFiltros] = useState({ id_usuario: '', desde: '', hasta: '' });

  function manejarFiltrar(e) {
    e.preventDefault();
    aplicarFiltros(filtros);
  }

  const columnas = [
    { clave: 'nombre_usuario', encabezado: 'Usuario' },
    {
      clave: 'estado',
      encabezado: 'Estado',
      render: (s) => <EstadoBadge codigo_estado={s.codigo_estado} texto={s.nombre_estado} />,
    },
    { clave: 'log_in', encabezado: 'Inicio', render: (s) => new Date(s.log_in).toLocaleString() },
    { clave: 'log_out', encabezado: 'Cierre', render: (s) => s.log_out ? new Date(s.log_out).toLocaleString() : '—' },
    { clave: 'ip_origen', encabezado: 'IP de origen' },
  ];

  return (
    <div>
      <h6 className="text-uppercase mb-3" style={{ letterSpacing: '0.06em' }}>Registro de accesos</h6>

      <form className="d-flex gap-2 flex-wrap align-items-end mb-3" onSubmit={manejarFiltrar}>
        <div>
          <label className="form-label">ID de usuario</label>
          <input className="form-control form-control-sm" value={filtros.id_usuario}
            onChange={(e) => setFiltros({ ...filtros, id_usuario: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Desde</label>
          <input type="date" className="form-control form-control-sm" value={filtros.desde}
            onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })} />
        </div>
        <div>
          <label className="form-label">Hasta</label>
          <input type="date" className="form-control form-control-sm" value={filtros.hasta}
            onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })} />
        </div>
        <button className="btn btn-primary btn-sm" type="submit">Filtrar</button>
      </form>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <DataTable columnas={columnas} filas={sesiones} claveFila="id_sesion" />
      <Pagination pagina={pagina} total_paginas={paginacion.total_paginas} total={paginacion.total} onChange={irAPagina} />
    </div>
  );
}

export default AccesosPage;