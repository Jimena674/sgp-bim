import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { SearchInput } from '../../components/common/SearchInput/SearchInput';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Toast } from '../../components/common/Toast/Toast';
import { useActividades } from '../../hooks/useActividades';

const FORM_VACIO = { nombre_actividad_catalogo: '' };
const LONGITUD_MAXIMA_NOMBRE = 100;
const RETARDO_BUSQUEDA_MS = 400;

function formatearFecha(valor) {
  return valor ? new Date(valor).toLocaleDateString() : '—';
}

function ActividadesPage() {
  const { actividades, paginacion, pagina, cargando, error, buscar, irAPagina, crear, actualizar, eliminar } = useActividades();

  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [actividadEditando, setActividadEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errorForm, setErrorForm] = useState(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'ok' });

  // Retardo para evitar una petición por cada tecla presionada en el buscador.
  useEffect(() => {
    const temporizador = setTimeout(() => buscar(textoBusqueda.trim()), RETARDO_BUSQUEDA_MS);
    return () => clearTimeout(temporizador);
  }, [textoBusqueda, buscar]);

  function abrirCreacion() {
    setActividadEditando(null);
    setForm(FORM_VACIO);
    setErrorForm(null);
    setModalAbierto(true);
  }

  function abrirEdicion(actividad) {
    setActividadEditando(actividad);
    setForm({ nombre_actividad_catalogo: actividad.nombre_actividad_catalogo });
    setErrorForm(null);
    setModalAbierto(true);
  }

  async function manejarGuardar(e) {
    e.preventDefault();
    setErrorForm(null);
    try {
      if (actividadEditando) {
        await actualizar(actividadEditando.id_actividad, form);
        setToast({ visible: true, mensaje: 'Actividad actualizada con éxito.', tipo: 'ok' });
      } else {
        await crear(form);
        setToast({ visible: true, mensaje: 'Actividad creada exitosamente.', tipo: 'ok' });
      }
      setModalAbierto(false);
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'No fue posible guardar la actividad.');
    }
  }

  async function manejarEliminar(actividad) {
    if (!window.confirm(`¿Eliminar la actividad "${actividad.nombre_actividad_catalogo}"?`)) return;
    try {
      await eliminar(actividad.id_actividad);
      setToast({ visible: true, mensaje: 'Actividad eliminada exitosamente.', tipo: 'ok' });
    } catch (err) {
      setToast({
        visible: true,
        mensaje: err.response?.data?.error || 'No fue posible eliminar la actividad.',
        tipo: 'error',
      });
    }
  }

  const columnas = [
    { clave: 'nombre_actividad_catalogo', encabezado: 'Actividad' },
    { clave: 'nombre_creador', encabezado: 'Creada por' },
    { clave: 'fecha_registro', encabezado: 'Fecha de creación', render: (a) => formatearFecha(a.fecha_registro) },
    {
      clave: 'fecha_actualizacion',
      encabezado: 'Última modificación',
      render: (a) => formatearFecha(a.fecha_actualizacion),
    },
    {
      clave: 'acciones',
      encabezado: '',
      render: (a) => (
        <div className="d-flex gap-1">
          <IconButton icono="bi-pencil" titulo="Editar" onClick={() => abrirEdicion(a)} />
          <IconButton icono="bi-trash" titulo="Eliminar" onClick={() => manejarEliminar(a)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="text-uppercase mb-0" style={{ letterSpacing: '0.06em' }}>Actividades</h6>
        <div className="d-flex gap-2">
          <SearchInput valor={textoBusqueda} onChange={setTextoBusqueda} placeholder="Buscar actividad…" />
          <Button size="sm" onClick={abrirCreacion}><i className="bi bi-plus me-1" />Nueva actividad</Button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <DataTable columnas={columnas} filas={actividades} claveFila="id_actividad" />
      <Pagination pagina={pagina} total_paginas={paginacion.total_paginas} total={paginacion.total} onChange={irAPagina} />

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{actividadEditando ? 'Editar actividad' : 'Nueva actividad'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={manejarGuardar}>
          <Modal.Body>
            {errorForm && <div className="alert alert-danger py-2">{errorForm}</div>}
            <div className="mb-2">
              <label className="form-label">Nombre *</label>
              <input className="form-control" required maxLength={LONGITUD_MAXIMA_NOMBRE}
                value={form.nombre_actividad_catalogo}
                onChange={(e) => setForm({ ...form, nombre_actividad_catalogo: e.target.value })} />
              <div className="form-text">Solo letras y espacios, máximo {LONGITUD_MAXIMA_NOMBRE} caracteres.</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button type="submit" disabled={cargando}>Guardar</Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Toast mensaje={toast.mensaje} visible={toast.visible} tipo={toast.tipo}
        onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}

export default ActividadesPage;
