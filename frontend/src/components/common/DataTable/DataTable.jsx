import { Fragment } from 'react';
import { Table } from 'react-bootstrap';
import styles from './DataTable.module.scss';

export function DataTable({ columnas, filas, claveFila = 'id', filaExpandida, renderExpandido }) {
  return (
    <div className={styles.contenedor}>
      <Table borderless className={styles.tabla}>
        <thead>
          <tr>{columnas.map((c) => <th key={c.clave}>{c.encabezado}</th>)}</tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr><td colSpan={columnas.length} className={styles.vacio}>Sin registros para mostrar.</td></tr>
          ) : (
            filas.map((fila) => (
              <Fragment key={fila[claveFila]}>
                <tr>
                  {columnas.map((c) => (
                    <td key={c.clave}>{c.render ? c.render(fila) : fila[c.clave]}</td>
                  ))}
                </tr>
                {filaExpandida?.(fila) && (
                  <tr>
                    <td colSpan={columnas.length} className={styles.filaExpandida}>
                      {renderExpandido(fila)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}