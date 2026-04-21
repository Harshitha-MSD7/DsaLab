import { useState } from 'react'
import { Plus, Search, Trash2, RotateCcw } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import './HashMapVisualizer.css'

const TABLE_SIZE = 10

function hashFn(key) {
  let h = 0
  for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) % TABLE_SIZE
  return h
}

const code = {
  python: [
    '# Python dict is a hash map',
    'hash_map = {}',
    '',
    'def put(key, value):',
    '    idx = hash(key) % TABLE_SIZE',
    '    hash_map[key] = value',
    '',
    'def get(key):',
    '    return hash_map.get(key)',
    '',
    '# Collision handling: chaining',
    'table = [[] for _ in range(TABLE_SIZE)]',
    '',
    'def chain_put(key, value):',
    '    idx = hash(key) % TABLE_SIZE',
    '    for pair in table[idx]:',
    '        if pair[0] == key: pair[1]=value; return',
    '    table[idx].append([key, value])',
  ],
  java: [
    'import java.util.HashMap;',
    'HashMap<String, Integer> map = new HashMap<>();',
    '',
    '// put(key, value)',
    'map.put("name", 42);  // O(1) average',
    '',
    '// get(key)',
    'int val = map.get("name"); // O(1) average',
    '',
    '// remove(key)',
    'map.remove("name"); // O(1) average',
    '',
    '// Internally uses chaining:',
    '// index = hash(key) % capacity',
    '// Each bucket is a linked list',
    '// Load factor triggers resize at 0.75',
  ],
  cpp: [
    '#include <unordered_map>',
    'unordered_map<string,int> map;',
    '',
    '// insert / update',
    'map["key"] = 42;       // O(1) avg',
    '',
    '// lookup',
    'int v = map["key"];    // O(1) avg',
    '',
    '// check existence',
    'map.count("key") > 0;  // O(1)',
    '',
    '// erase',
    'map.erase("key");      // O(1) avg',
    '',
    '// Collision: open addressing or chaining',
  ],
}

const complexity = {
  time: 'O(1) avg',
  best: 'O(1)',
  space: 'O(n)',
  notes: 'O(n) worst case with many hash collisions. A good hash function distributes keys uniformly. Rehashing at load factor ≥ 0.75.',
}

export default function HashMapVisualizer() {
  const [language, setLanguage] = useState('java')
  const [table, setTable] = useState(Array.from({ length: TABLE_SIZE }, () => []))
  const [keyInput, setKeyInput] = useState('')
  const [valInput, setValInput] = useState('')
  const [stepDesc, setStepDesc] = useState('')
  const [highlighted, setHighlighted] = useState(null)

  function flash(idx, desc) {
    setHighlighted(idx)
    setStepDesc(desc)
    setTimeout(() => setHighlighted(null), 1000)
  }

  function handlePut() {
    if (!keyInput) return
    const idx = hashFn(keyInput)
    const newTable = table.map(b => [...b])
    const bucket = newTable[idx]
    const existing = bucket.findIndex(([k]) => k === keyInput)
    if (existing >= 0) {
      bucket[existing] = [keyInput, valInput]
      flash(idx, `Updated: key "${keyInput}" → ${valInput} (hash: ${idx})`)
    } else {
      bucket.push([keyInput, valInput])
      flash(idx, `Inserted: hash("${keyInput}") = ${idx}, placed in bucket ${idx}${bucket.length > 1 ? ' (collision! chaining)' : ''}`)
    }
    setTable(newTable)
    setKeyInput('')
    setValInput('')
  }

  function handleGet() {
    if (!keyInput) return
    const idx = hashFn(keyInput)
    const bucket = table[idx]
    const entry = bucket.find(([k]) => k === keyInput)
    flash(idx, entry
      ? `Found! key "${keyInput}" → ${entry[1]} at bucket ${idx}`
      : `Not found: key "${keyInput}" not in bucket ${idx}`)
  }

  function handleDelete(bucketIdx, entryIdx) {
    const newTable = table.map(b => [...b])
    newTable[bucketIdx].splice(entryIdx, 1)
    setTable(newTable)
    flash(bucketIdx, `Removed entry from bucket ${bucketIdx}`)
  }

  function reset() {
    setTable(Array.from({ length: TABLE_SIZE }, () => []))
    setStepDesc('')
    setHighlighted(null)
  }

  const controls = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <input type="text" value={keyInput} onChange={e => setKeyInput(e.target.value)}
        placeholder="Key..." style={{ width: 90 }}
        onKeyDown={e => e.key === 'Enter' && handlePut()} />
      <input type="text" value={valInput} onChange={e => setValInput(e.target.value)}
        placeholder="Value..." style={{ width: 90 }}
        onKeyDown={e => e.key === 'Enter' && handlePut()} />
      <button className="btn btn-primary" onClick={handlePut}><Plus size={14} /> Put</button>
      <button className="btn btn-secondary" onClick={handleGet}><Search size={14} /> Get</button>
      <button className="btn btn-ghost btn-icon tooltip-container" onClick={reset}>
        <RotateCcw size={16} /><span className="tooltip">Reset</span>
      </button>
    </div>
  )

  const visualization = (
    <div className="hm-canvas">
      <div className="hm-table">
        {table.map((bucket, i) => (
          <div key={i} className={`hm-row ${highlighted === i ? 'highlighted' : ''}`}>
            <div className="hm-idx">
              <span>{i}</span>
              <span className="hm-hash-fn">h={i}</span>
            </div>
            <div className="hm-bucket">
              {bucket.length === 0 ? (
                <div className="hm-empty-bucket">∅</div>
              ) : (
                bucket.map(([k, v], j) => (
                  <div key={j} className="hm-entry">
                    <span className="hm-key">{k}</span>
                    <span className="hm-sep">→</span>
                    <span className="hm-val">{v || '—'}</span>
                    <button className="hm-delete" onClick={() => handleDelete(i, j)} title="Remove">
                      <Trash2 size={10} />
                    </button>
                    {j < bucket.length - 1 && <span className="hm-chain">→</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="hm-info">
        <div className="hm-info-item">
          <span>Entries:</span>
          <span className="mono">{table.reduce((a, b) => a + b.length, 0)}</span>
        </div>
        <div className="hm-info-item">
          <span>Load factor:</span>
          <span className="mono">{(table.reduce((a, b) => a + b.length, 0) / TABLE_SIZE).toFixed(2)}</span>
        </div>
        <div className="hm-info-item">
          <span>Collisions:</span>
          <span className="mono" style={{ color: 'var(--orange)' }}>
            {table.filter(b => b.length > 1).length}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Hash Map"
      subtitle="Key-value store with O(1) average operations via chaining"
      category="hashMap"
      algoKey="hashMap"
      controls={controls}
      visualization={visualization}
      stepDesc={stepDesc}
      code={code}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={4}
      complexity={complexity}
    />
  )
}
