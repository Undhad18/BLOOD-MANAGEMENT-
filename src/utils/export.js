export function exportCsv(filename, rows) {
  if (!rows || rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(',')].concat(rows.map(r=> headers.map(h=> JSON.stringify(r[h] ?? '')).join(','))).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : filename + '.csv'
  a.click()
  URL.revokeObjectURL(url)
}


