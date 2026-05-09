import { IconSpinner } from './Icons'
import EmptyState from './EmptyState'

const Table = ({ columns, data, loading, emptyMessage = 'No records found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <IconSpinner size={24} className="text-gray-400" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              className="hover:bg-gray-50 transition-colors duration-100"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700 font-normal whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
