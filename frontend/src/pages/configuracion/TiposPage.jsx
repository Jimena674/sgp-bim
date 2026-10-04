import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Toast } from '../../components/common/Toast/Toast';
import { useTipos } from '../../hooks/useTipos';
import { useModulos } from '../../hooks/useModulos';

const FORM_VACIO = { id_modulo: '', nombre_tipo: '', codigo_tipo: '' };

function TiposPage() {
  const { tipos, cargando, error, crear, actualizar, eliminar } = useTipos();
  const { modulos } = useModulos();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errorForm, setErrorForm] = useState(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'ok' });

  function abrirCreacion() {
    setTipoEditando(null);
    setForm(FORM_VACIO);
    setErrorForm(null);
    setModalAbierto(true);
  }

  function abrirEdicion(tipo) {
    setTipoEditando(tipo);
    setForm({ id_modulo: tipo.id_modulo, nombre_tipo: tipo.nombre_tipo, codigo_tipo: tipo.codigo_tipo });
    setErrorForm(null);
    setModalAbierto(true);
  }

  async function manejarGuardar(e) {
    e.preventDefault();
    setErrorForm(null);
    try {
      if (tipoEditando) {
        const { id_modulo, ...datosEditables } = form;
        await actualizar(tipoEditando.id_tipo, datosEditables);
        setToast({ visible: true, mensaje: 'Tipo actualizado con éxito.', tipo: 'ok' });
      } else {
        await crear(form);
        setToast({ visible: true, mensaje: 'Tipo creado exitosamente.', tipo: 'ok' });
      }
      setModalAbierto(false);
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'No fue posible guardar el tipo.');
    }
  }

  async function manejarEliminar(tipo) {
    if (!window.confirm(`¿Eliminar el tipo "${tipo.nombre_tipo}"?`)) return;
    try {
      await eliminar(tipo.id_tipo);
      setToast({ visible: true, mensaje: 'Tipo eliminado exitosamente.', tipo: 'ok' });
    } catch (err) {
      setToast({ visible: true, mensaje: err.response?.data?.error || 'No fue posible eliminar el tipo.', tipo: 'error' });
    }
  }

  const columnas = [
    { clave: 'nombre_modulo', encabezado: 'Módulo' },
    { clave: 'nombre_tipo', encabezado: 'Nombre' },
    { clave: 'codigo_tipo', encabezado: 'Código' },
    {
      clave: 'acciones',
      encabezado: '',
      render: (t) => (
        <div className="d-flex gap-1">
          <IconButton icono="bi-pencil" titulo="Editar" onClick={() => abrirEdicion(t)} />
          <IconButton icono="bi-trash" titulo="Eliminar" onClick={() => manejarEliminar(t)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="text-uppercase mb-0" style={{ letterSpacing: '0.06em' }}>Tipos</h6>
        <Button size="sm" onClick={abrirCreacion}><i className="bi bi-plus me-1" />Nuevo tipo</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <DataTable columnas={columnas} filas={tipos} claveFila="id_tipo" />

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{tipoEditando ? 'Editar tipo' : 'Nuevo tipo'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={manejarGuardar}>
          <Modal.Body>
            {errorForm && <div className="alert alert-danger py-2">{errorForm}</div>}
            <div className="mb-2">
              <label className="form-label">Módulo *</label>
              <select className="form-select" required disabled={!!tipoEditando} value={form.id_modulo}
                onChange={(e) => setForm({ ...form, id_modulo: e.target.value })}>
                <option value="">Seleccionar…</option>
                {modulos.map((m) => (
                  <option key={m.id_modulo} value={m.id_modulo}>{m.nombre_modulo}</option>
                ))}
              </select>
              {tipoEditando && <div className="form-text">El módulo no se puede modificar tras la creación.</div>}
            </div>
            <div className="mb-2">
              <label className="form-label">Nombre *</label>
              <input className="form-control" required value={form.nombre_tipo}
                onChange={(e) => setForm({ ...form, nombre_tipo: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Código *</label>
              <input className="form-control" required value={form.codigo_tipo}
                onChange={(e) => setForm({ ...form, codigo_tipo: e.target.value.toUpperCase() })} />
              <div className="form-text">Solo mayúsculas, máximo 10 caracteres.</div>
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

export default TiposPage;