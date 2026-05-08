import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

const Table = ({ columns, data, loading, emptyMessage = 'No records found' }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto rounded-3xl border-2 border-orange-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-violet-50 to-orange-50 border-b-2 border-orange-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3.5 text-left text-xs font-black text-violet-600 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50 bg-white">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              className="hover:bg-amber-50/50 transition-colors duration-150"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 text-gray-700 font-medium whitespace-nowrap">
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
