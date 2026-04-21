import './ComplexityPanel.css'

const BIG_O_COLORS = {
  'O(1)':        '#10b981',
  'O(log n)':    '#06b6d4',
  'O(n)':        '#eab308',
  'O(n log n)':  '#f97316',
  'O(nk)':       '#f97316',
  'O(n²)':       '#ec4899',
  'O(V + E)':    '#06b6d4',
  'O((V+E) log V)': '#f97316',
  'O(VE)':       '#ec4899',
  'O(h)':        '#eab308',
  'Varies':      '#8b5cf6',
}

function ComplexityBadge({ value }) {
  const color = BIG_O_COLORS[value] || '#8b5cf6'
  return (
    <span className="complexity-badge mono" style={{ '--c': color }}>
      {value}
    </span>
  )
}

export default function ComplexityPanel({ data }) {
  if (!data) return null

  const entries = [
    data.time        && { label: 'Time (avg/worst)', value: data.time },
    data.best        && { label: 'Time (best)',       value: data.best },
    data.space       && { label: 'Space',             value: data.space },
    data.search      && { label: 'Search',            value: data.search },
    data.insert      && { label: 'Insert',            value: data.insert },
    data.delete      && { label: 'Delete',            value: data.delete },
    data.extractMin  && { label: 'Extract Min',       value: data.extractMin },
    data.peek        && { label: 'Peek (top)',        value: data.peek },
  ].filter(Boolean)

  return (
    <div className="complexity-panel">
      <div className="complexity-title">Big-O Complexity</div>

      <div className="complexity-grid">
        {entries.map(e => (
          <div key={e.label} className="complexity-row">
            <span className="complexity-label">{e.label}</span>
            <ComplexityBadge value={e.value} />
          </div>
        ))}
        {data.stable !== undefined && (
          <div className="complexity-row">
            <span className="complexity-label">Stable Sort</span>
            <span className={`complexity-stable ${data.stable ? 'yes' : 'no'}`}>
              {data.stable ? 'Yes ✓' : 'No ✗'}
            </span>
          </div>
        )}
      </div>

      {data.notes && (
        <div className="complexity-notes">{data.notes}</div>
      )}

      {/* Visual O notation scale */}
      <div className="complexity-scale">
        <div className="complexity-scale-title">Performance scale:</div>
        <div className="complexity-scale-items">
          {[['O(1)', '#10b981'], ['O(log n)', '#06b6d4'], ['O(n)', '#eab308'], ['O(n log n)', '#f97316'], ['O(n²)', '#ec4899']].map(([label, color]) => (
            <div key={label} className="complexity-scale-item">
              <div className="complexity-scale-dot" style={{ background: color }} />
              <span className="complexity-scale-label mono">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
