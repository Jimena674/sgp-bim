import { useState, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { RolBadge } from '../../components/common/RolBadge';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Toast } from '../../components/common/Toast/Toast';
import { useRoles } from '../../hooks/useRoles';
import { usePermisos } from '../../hooks/usePermisos';
import { useAsignacionesPermisos } from '../../hooks/useAsignacionesPermisos';
import api from '../../services/api';

const FORM_VACIO = { nombre_rol: '', codigo_rol: '', descripcion_rol: '', bg_color: '' };

function RolesPage() {
  const { roles, cargando, error, crear, actualizar, eliminar } = useRoles();
  const { permisos } = usePermisos();
  const { asignaciones, recargar: recargarAsignaciones } = useAsignacionesPermisos();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [rolEditando, setRolEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errorForm, setErrorForm] = useState(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'ok' });
  const [permisoForm, setPermisoForm] = useState({ codigo_rol: '', codigo_permiso: '' });

  // Conjunto "idRol-idPermiso" para consultar en O(1) si un rol tiene un permiso.
  const asignado = useMemo(
    () => new Set(asignaciones.map((a) => `${a.id_rol}-${a.id_permiso}`)),
    [asignaciones]
  );

  function abrirCreacion() {
    setRolEditando(null);
    setForm(FORM_VACIO);
    setErrorForm(null);
    setModalAbierto(true);
  }

  function abrirEdicion(rol) {
    setRolEditando(rol);
    setForm({ ...FORM_VACIO, ...rol });
    setErrorForm(null);
    setModalAbierto(true);
  }

  async function manejarGuardar(e) {
    e.preventDefault();
    setErrorForm(null);
    try {
      if (rolEditando) {
        await actualizar(rolEditando.id_rol, form);
        setToast({ visible: true, mensaje: 'Rol actualizado con éxito.', tipo: 'ok' });
      } else {
        await crear(form);
        setToast({ visible: true, mensaje: 'Rol creado exitosamente.', tipo: 'ok' });
      }
      setModalAbierto(false);
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'No fue posible guardar el rol.');
    }
  }

  async function manejarEliminar(rol) {
    if (!window.confirm(`¿Eliminar el rol "${rol.nombre_rol}"?`)) return;
    try {
      await eliminar(rol.id_rol);
      await recargarAsignaciones();
      setToast({ visible: true, mensaje: 'Rol eliminado exitosamente.', tipo: 'ok' });
    } catch (err) {
      setToast({ visible: true, mensaje: err.response?.data?.error || 'No fue posible eliminar el rol.', tipo: 'error' });
    }
  }

  async function manejarAsignarPermiso(e) {
    e.preventDefault();
    try {
      await api.post('/roles/asignar-permiso', permisoForm);
      await recargarAsignaciones();
      setToast({ visible: true, mensaje: 'Permiso asignado exitosamente.', tipo: 'ok' });
      setPermisoForm({ codigo_rol: '', codigo_permiso: '' });
    } catch (err) {
      setToast({ visible: true, mensaje: err.response?.data?.error || 'No fue posible asignar el permiso.', tipo: 'error' });
    }
  }

  async function manejarRevocarPermiso(e) {
    e.preventDefault();
    try {
      await api.put('/roles/revocar-permiso', permisoForm);
      await recargarAsignaciones();
      setToast({ visible: true, mensaje: 'Permiso revocado exitosamente.', tipo: 'ok' });
    } catch (err) {
      setToast({ visible: true, mensaje: err.response?.data?.error || 'No fue posible revocar el permiso.', tipo: 'error' });
    }
  }

  const columnasRoles = [
    {
      clave: 'nombre_rol',
      encabezado: 'Rol',
      render: (r) => <RolBadge nombre_rol={r.nombre_rol} codigo_rol={r.codigo_rol} bg_color={r.bg_color} />,
    },
    { clave: 'codigo_rol', encabezado: 'Código' },
    { clave: 'descripcion_rol', encabezado: 'Descripción' },
    {
      clave: 'acciones',
      encabezado: '',
      render: (r) => (
        <div className="d-flex gap-1">
          <IconButton icono="bi-pencil" titulo="Editar" onClick={() => abrirEdicion(r)} />
          <IconButton icono="bi-trash" titulo="Eliminar" onClick={() => manejarEliminar(r)} />
        </div>
      ),
    },
  ];

  // Matriz: una fila por permiso, una columna por rol.
  const columnasMatriz = [
    {
      clave: 'nombre_permiso',
      encabezado: 'Permiso',
      render: (f) => f.esModulo
        ? <strong style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#4A90D9' }}>
            {f.nombre_modulo}
          </strong>
        : <span style={{ paddingLeft: '12px' }}>{f.nombre_permiso}</span>,
    },
    ...roles.map((r) => ({
      clave: `rol_${r.id_rol}`,
      encabezado: r.nombre_rol,
      render: (f) =>
        !f.esModulo && asignado.has(`${r.id_rol}-${f.id_permiso}`) ? (
          <i
            className="bi bi-circle-fill"
            style={{ color: '#4AC78B', fontSize: '0.6rem' }}
            title={`${r.nombre_rol}: ${f.nombre_permiso}`}
            aria-label="Permiso asignado"
          />
        ) : null,
    })),
  ];

  const filasMatriz = useMemo(() => {
    const filas = [];
    let moduloActual = null;
    permisos.forEach((p) => {
      if (p.id_modulo !== moduloActual) {
        moduloActual = p.id_modulo;
        filas.push({ clave_fila: `mod-${p.id_modulo}`, esModulo: true, nombre_modulo: p.nombre_modulo });
      }
      filas.push({ ...p, clave_fila: `perm-${p.id_permiso}` });
    });
    return filas;
  }, [permisos]);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="text-uppercase mb-0" style={{ letterSpacing: '0.06em' }}>Roles</h6>
        <Button size="sm" onClick={abrirCreacion}><i className="bi bi-plus me-1" />Nuevo rol</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <DataTable columnas={columnasRoles} filas={roles} claveFila="id_rol" />

      <div className="mt-4">
        <h6 className="text-uppercase mb-3" style={{ letterSpacing: '0.06em' }}>Matriz de permisos por rol</h6>
        <DataTable columnas={columnasMatriz} filas={filasMatriz} claveFila="clave_fila" />
      </div>

      <div className="mt-4">
        <h6 className="text-uppercase" style={{ letterSpacing: '0.06em' }}>Asignar o revocar permiso</h6>
        <form className="d-flex gap-2 flex-wrap align-items-end">
          <div>
            <label className="form-label">Rol</label>
            <select className="form-select form-select-sm" value={permisoForm.codigo_rol}
              onChange={(e) => setPermisoForm({ ...permisoForm, codigo_rol: e.target.value })}>
              <option value="">Seleccionar…</option>
              {roles.map((r) => (
                <option key={r.id_rol} value={r.codigo_rol}>{r.nombre_rol}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Permiso</label>
            <select className="form-select form-select-sm" value={permisoForm.codigo_permiso}
              onChange={(e) => setPermisoForm({ ...permisoForm, codigo_permiso: e.target.value })}>
              <option value="">Seleccionar…</option>
              {permisos.map((p) => (
                <option key={p.id_permiso} value={p.codigo_permiso}>{p.nombre_permiso}</option>
              ))}
            </select>
          </div>
          <Button size="sm" onClick={manejarAsignarPermiso}>Asignar</Button>
          <Button size="sm" variant="outline-secondary" onClick={manejarRevocarPermiso}>Revocar</Button>
        </form>
      </div>

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{rolEditando ? 'Editar rol' : 'Nuevo rol'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={manejarGuardar}>
          <Modal.Body>
            {errorForm && <div className="alert alert-danger py-2">{errorForm}</div>}
            <div className="mb-2">
              <label className="form-label">Nombre *</label>
              <input className="form-control" required value={form.nombre_rol}
                onChange={(e) => setForm({ ...form, nombre_rol: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Código *</label>
              <input className="form-control" required value={form.codigo_rol}
                onChange={(e) => setForm({ ...form, codigo_rol: e.target.value })} />
              <div className="form-text">Solo minúsculas, sin tildes ni ñ.</div>
            </div>
            <div className="mb-2">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" value={form.descripcion_rol || ''}
                onChange={(e) => setForm({ ...form, descripcion_rol: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Color (hex)</label>
              <input type="color" className="form-control form-control-color" value={form.bg_color || '#4A90D9'}
                onChange={(e) => setForm({ ...form, bg_color: e.target.value })} />
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

export default RolesPage;