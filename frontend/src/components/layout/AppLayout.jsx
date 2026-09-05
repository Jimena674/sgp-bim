import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './AppLayout.module.scss';

function AppLayout({ children, titulo, breadcrumb }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.contenido}>
        <Topbar titulo={titulo} breadcrumb={breadcrumb} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;