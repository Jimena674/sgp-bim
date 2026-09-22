import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DataTable } from '../../components/common/DataTable/DataTable';
import { SearchInput } from '../../components/common/SearchInput/SearchInput';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { IconButton } from '../../components/common/IconButton/IconButton';
import { Toast } from '../../components/common/Toast/Toast';
import { EstadoBadge } from '../../components/common/EstadoBadge/EstadoBadge';
import { RolBadge } from '../../components/common/RolBadge';
import { useUsuarios } from '../../hooks/useUsuarios';

const FORM_VACIO = { nombre_usuario: '', id_tipo: '', numero_id: '', correo: '', telefono: '', password: '' };

function UsuariosPage() {
  const { usuarios, paginacion, pagina, cargando, error, aplicarFiltros, irAPagina, crear, actualizar, cambiarEstado } = useUsuarios();

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [errorForm, setErrorForm] = useState(null);
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'ok' });

  // Debounce: evita una petición por cada tecla presionada en el buscador.
  useEffect(() => {
    const temporizador = setTimeout(() => {
      aplicarFiltros({ busqueda });
    }, 400);
    return () => clearTimeout(temporizador);
  }, [busqueda, aplicarFiltros]);

  function abrirCreacion() {
    setUsuarioEditando(null);
    setForm(FORM_VACIO);
    setErrorForm(null);
    setModalAbierto(true);
  }

  function abrirEdicion(usuario) {
    setUsuarioEditando(usuario);
    setForm({ ...FORM_VACIO, ...usuario, password: '' });
    setErrorForm(null);
    setModalAbierto(true);
  }

  async function manejarGuardar(e) {
    e.preventDefault();
    setErrorForm(null);
    try {
      if (usuarioEditando) {
        const datos = { ...form };
        if (!datos.password) delete datos.password;
        await actualizar(usuarioEditando.id_usuario, datos);
        setToast({ visible: true, mensaje: 'Usuario actualizado exitosamente.', tipo: 'ok' });
      } else {
        await crear(form);
        setToast({ visible: true, mensaje: 'Usuario creado exitosamente.', tipo: 'ok' });
      }
      setModalAbierto(false);
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'No fue posible guardar el usuario.');
    }
  }

  async function manejarCambioEstado(id, codigo_estado) {
    try {
      await cambiarEstado(id, codigo_estado);
      setToast({ visible: true, mensaje: 'Estado actualizado exitosamente.', tipo: 'ok' });
    } catch (err) {
      setToast({ visible: true, mensaje: err.response?.data?.error || 'No fue posible cambiar el estado.', tipo: 'error' });
    }
  }

  const columnas = [
    { clave: 'nombre_usuario', encabezado: 'Usuario' },
    { clave: 'numero_id', encabezado: 'Identificación' },
    { clave: 'correo', encabezado: 'Correo' },
    {
      clave: 'rol',
      encabezado: 'Rol',
      render: (u) => u.codigo_rol
        ? <RolBadge nombre_rol={u.nombre_rol} codigo_rol={u.codigo_rol} bg_color={u.bg_color} />
        : <span className="text-muted" style={{ fontSize: '.75rem' }}>Sin rol</span>,
    },
    {
      clave: 'estado',
      encabezado: 'Estado',
      render: (u) => u.codigo_estado
        ? <EstadoBadge codigo_estado={u.codigo_estado} texto={u.nombre_estado} />
        : <span className="text-muted" style={{ fontSize: '.75rem' }}>—</span>,
    },
    {
      clave: 'acciones',
      encabezado: '',
      render: (u) => (
        <div className="d-flex gap-1">
          <IconButton icono="bi-pencil" titulo="Editar" onClick={() => abrirEdicion(u)} />
          <IconButton icono="bi-toggle-on" titulo="Activar" onClick={() => manejarCambioEstado(u.id_usuario, 'ACT')} />
          <IconButton icono="bi-toggle-off" titulo="Desactivar" onClick={() => manejarCambioEstado(u.id_usuario, 'INA')} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="text-uppercase mb-0" style={{ letterSpacing: '0.06em' }}>Usuarios</h6>
        <div className="d-flex gap-2">
          <SearchInput valor={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o correo…" />
          <Button size="sm" onClick={abrirCreacion}><i className="bi bi-plus me-1" />Nuevo usuario</Button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <DataTable columnas={columnas} filas={usuarios} claveFila="id_usuario" />
      <Pagination pagina={pagina} total_paginas={paginacion.total_paginas} total={paginacion.total} onChange={irAPagina} />

      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}</Modal.Title>
        </Modal.Header>
        <form onSubmit={manejarGuardar}>
          <Modal.Body>
            {errorForm && <div className="alert alert-danger py-2">{errorForm}</div>}
            <div className="mb-2">
              <label className="form-label">Nombre completo *</label>
              <input className="form-control" required value={form.nombre_usuario}
                onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })} />
            </div>
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label">Tipo de identificación *</label>
                <input className="form-control" required value={form.id_tipo}
                  onChange={(e) => setForm({ ...form, id_tipo: e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Número de identificación *</label>
                <input className="form-control" required value={form.numero_id}
                  onChange={(e) => setForm({ ...form, numero_id: e.target.value })} />
              </div>
            </div>
            <div className="mb-2 mt-2">
              <label className="form-label">Correo *</label>
              <input type="email" className="form-control" required value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">Teléfono</label>
              <input className="form-control" value={form.telefono || ''}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="form-label">
                {usuarioEditando ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
              </label>
              <input type="password" className="form-control" required={!usuarioEditando} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <div className="form-text">Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.</div>
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

export default UsuariosPage;