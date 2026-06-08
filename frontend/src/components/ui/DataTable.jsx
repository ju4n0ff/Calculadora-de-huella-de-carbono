import PropTypes from 'prop-types'

export default function DataTable({ headers, rows, emptyMessage = 'No hay datos disponibles.' }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headers.length} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 20 }}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={row.key ?? i}>
              {row.cells.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

DataTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cells: PropTypes.arrayOf(PropTypes.node).isRequired,
  })).isRequired,
  emptyMessage: PropTypes.string,
}
