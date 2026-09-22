import {NavLink} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import styles from './Sidebar.module.scss';

const GRUPOS_NAV = [
  {
    etiqueta:'General',
    items: [{to: '/dashboard', icono:'bi-speedometer2', texto:'Panel Principal'}],
  },
  {
    etiqueta: 'Administración',
    items: [
      { to: '/usuarios', icono: 'bi-people', texto: 'Usuarios' },
      { to: '/roles', icono: 'bi-shield-check', texto: 'Roles y Permisos' },
      { to: '/accesos', icono: 'bi-key', texto: 'Control de acceso' },
      { to: '/terceros', icono: 'bi-building', texto: 'Terceros' },
    ],
  },
  {
    etiqueta: 'Catálogos',
    items: [
      { to: '/actividades', icono: 'bi-list-check', texto: 'Actividades' },
      { to: '/plantillas', icono: 'bi-file-earmark-ruled', texto: 'Plantillas' },
    ],
  },
  {
    etiqueta: 'Proyectos',
    items: [
      { to: '/proyectos', icono: 'bi-folder2-open', texto: 'Proyectos' },
      { to: '/planificacion', icono: 'bi-calendar3', texto: 'Planificación' },
      { to: '/avance', icono: 'bi-bar-chart-steps', texto: 'Control de Avance' },
      { to: '/cambios', icono: 'bi-arrow-repeat', texto: 'Cambios' },
      { to: '/entregas', icono: 'bi-box-seam', texto: 'Entregas' },
      { to: '/comunicaciones', icono: 'bi-chat-square-text', texto: 'Comunicaciones' },
    ],
  },
  {
    etiqueta: 'Seguimiento',
    items: [
      { to: '/indicadores', icono: 'bi-graph-up', texto: 'Indicadores' },
      { to: '/notificaciones', icono: 'bi-bell', texto: 'Notificaciones' },
    ],
  },
  {
    etiqueta: 'Sistema',
    items: [{ to: '/configuracion', icono: 'bi-sliders', texto: 'Configuración' }],
  },
]

function Sidebar() {
  
  const {usuario} = useAuth();
  const iniciales = (usuario?.nombre_usuario || '?').trim().slice(0,2).toUpperCase();

  return (
    <nav className={styles.sidebar}>

      <div className={styles.marca}> 
        <div className={styles.iconoMarca}>
          <i className='bi bi-layers'/>
        </div>
        Gest
      </div>

      <div className={styles.navScroll}>
        {GRUPOS_NAV.map((grupo) => (
          <div key={grupo.etiqueta}>
            <div className={styles.etiquetaSeccion}>
              {grupo.etiqueta}
            </div>
            {grupo.items.map((item)=>(
              <NavLink
                key={item.to}
                to={item.to}
                className={({isActive})=>
                  isActive ? `${styles.navLink} ${styles.activo}`:styles.navLink
                }
              >
                <i className={`bi ${item.icono}`}/>
                <span>{item.texto}</span>
              </NavLink>
            ))}      
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.userPill}>
          <div className={styles.avatar}>{iniciales}</div>
          <div className={styles.userInfo}>
            <div className={styles.userNombre}>{usuario?.nombre_usuario || 'Usuario'}</div>
          </div>
        </div>
      </div>
      
    </nav>
  );
}

export default Sidebar;