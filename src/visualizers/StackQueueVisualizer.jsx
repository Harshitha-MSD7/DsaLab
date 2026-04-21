import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Minus, RotateCcw } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import './StackQueueVisualizer.css'

const TYPES = {
  stack: { label: 'Stack (LIFO)' },
  queue: { label: 'Queue (FIFO)' },
}

const code = {
  stack: {
    python: [
      '# Python list as stack',
      'stack = []',
      '',
      'def push(val):',
      '    stack.append(val)   # O(1)',
      '',
      'def pop():',
      '    if not stack: raise Exception("Empty")',
      '    return stack.pop()  # O(1) - removes top',
      '',
      'def peek():',
      '    return stack[-1]    # O(1)',
      '',
      '# LIFO: Last In, First Out',
    ],
    java: [
      'import java.util.Deque;',
      'import java.util.ArrayDeque;',
      '',
      'Deque<Integer> stack = new ArrayDeque<>();',
      '',
      'void push(int val) {',
      '    stack.push(val);    // O(1)',
      '}',
      '',
      'int pop() {',
      '    return stack.pop(); // O(1) - removes top',
      '}',
      '',
      'int peek() {',
      '    return stack.peek(); // O(1)',
      '}',
    ],
    cpp: [
      '#include <stack>',
      'stack<int> st;',
      '',
      'void push(int val) {',
      '    st.push(val);     // O(1)',
      '}',
      '',
      'int pop() {',
      '    int top = st.top();',
      '    st.pop();         // O(1)',
      '    return top;',
      '}',
      '',
      'int peek() {',
      '    return st.top(); // O(1)',
      '}',
    ],
  },
  queue: {
    python: [
      'from collections import deque',
      'queue = deque()',
      '',
      'def enqueue(val):',
      '    queue.append(val)       # O(1) - add to back',
      '',
      'def dequeue():',
      '    if not queue: raise Exception("Empty")',
      '    return queue.popleft()  # O(1) - remove front',
      '',
      'def peek():',
      '    return queue[0]         # O(1)',
      '',
      '# FIFO: First In, First Out',
    ],
    java: [
      'import java.util.Queue;',
      'import java.util.LinkedList;',
      '',
      'Queue<Integer> queue = new LinkedList<>();',
      '',
      'void enqueue(int val) {',
      '    queue.offer(val);    // O(1) - add to back',
      '}',
      '',
      'int dequeue() {',
      '    return queue.poll(); // O(1) - remove front',
      '}',
      '',
      'int peek() {',
      '    return queue.peek(); // O(1)',
      '}',
    ],
    cpp: [
      '#include <queue>',
      'queue<int> q;',
      '',
      'void enqueue(int val) {',
      '    q.push(val);       // O(1) - back',
      '}',
      '',
      'int dequeue() {',
      '    int front = q.front();',
      '    q.pop();           // O(1) - front',
      '    return front;',
      '}',
      '',
      'int peek() {',
      '    return q.front();  // O(1)',
      '}',
    ],
  },
}

const complexity = {
  stack: { insert: 'O(1)', delete: 'O(1)', peek: 'O(1)', space: 'O(n)', notes: 'All operations are O(1). Used in undo/redo, call stacks, DFS.' },
  queue: { insert: 'O(1)', delete: 'O(1)', peek: 'O(1)', space: 'O(n)', notes: 'All operations are O(1). Used in BFS, task scheduling, buffering.' },
}

export default function StackQueueVisualizer() {
  const { type = 'stack' } = useParams()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('java')
  const [items, setItems] = useState([10, 20, 30])
  const [inputVal, setInputVal] = useState('')
  const [stepDesc, setStepDesc] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [animating, setAnimating] = useState(null)

  function flash(idx, desc, delay = 0) {
    setTimeout(() => {
      setHighlighted(idx)
      setStepDesc(desc)
      setTimeout(() => { setHighlighted(null) }, 800)
    }, delay)
  }

  function push() {
    const v = parseInt(inputVal)
    if (isNaN(v)) return
    setAnimating('push')
    setItems(prev => type === 'stack' ? [...prev, v] : [...prev, v])
    const idx = type === 'stack' ? items.length : items.length
    flash(idx, type === 'stack' ? `Pushed ${v} onto top of stack` : `Enqueued ${v} at back of queue`)
    setTimeout(() => setAnimating(null), 400)
    setInputVal('')
  }

  function pop() {
    if (items.length === 0) return
    const removed = type === 'stack' ? items[items.length - 1] : items[0]
    const idx = type === 'stack' ? items.length - 1 : 0
    flash(idx, type === 'stack' ? `Popped ${removed} from top` : `Dequeued ${removed} from front`)
    setAnimating('pop')
    setTimeout(() => {
      setItems(prev => type === 'stack' ? prev.slice(0, -1) : prev.slice(1))
      setAnimating(null)
    }, 400)
  }

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div className="algo-tabs">
        {Object.entries(TYPES).map(([k, v]) => (
          <button key={k} className={`algo-tab ${k === type ? 'active' : ''}`}
            onClick={() => navigate(`/stack-queue/${k}`)}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
          placeholder="Value..." style={{ width: 100 }}
          onKeyDown={e => e.key === 'Enter' && push()} />
        <button className="btn btn-primary" onClick={push}>
          <Plus size={14} /> {type === 'stack' ? 'Push' : 'Enqueue'}
        </button>
        <button className="btn btn-secondary" onClick={pop} disabled={items.length === 0}>
          <Minus size={14} /> {type === 'stack' ? 'Pop' : 'Dequeue'}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => { setItems([10, 20, 30]); setStepDesc('') }}>
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )

  const visualization = type === 'stack' ? (
    <div className="sq-canvas">
      <div className="stack-container">
        <div className="stack-label top">← TOP (most recent)</div>
        <div className="stack-items">
          {[...items].reverse().map((val, i) => (
            <div key={items.length - 1 - i}
              className={`stack-item ${highlighted === items.length - 1 - i ? 'highlighted' : ''} ${i === 0 ? 'top-item' : ''}`}>
              <span>{val}</span>
              {i === 0 && <span className="sq-top-badge">TOP</span>}
            </div>
          ))}
          {items.length === 0 && <div className="sq-empty">Stack is empty</div>}
        </div>
        <div className="stack-base" />
        <div className="stack-label bottom">← BOTTOM</div>
      </div>
      <div className="sq-info">
        <div className="sq-info-row"><span>Size:</span><span className="mono">{items.length}</span></div>
        <div className="sq-info-row"><span>Top:</span><span className="mono">{items.length > 0 ? items[items.length - 1] : 'null'}</span></div>
      </div>
    </div>
  ) : (
    <div className="sq-canvas">
      <div className="queue-container">
        <div className="queue-label">FRONT →</div>
        <div className="queue-items">
          {items.map((val, i) => (
            <div key={i}
              className={`queue-item ${highlighted === i ? 'highlighted' : ''} ${i === 0 ? 'front-item' : ''} ${i === items.length - 1 ? 'back-item' : ''}`}>
              <span>{val}</span>
              {i === 0 && <span className="sq-badge sq-front">F</span>}
              {i === items.length - 1 && i !== 0 && <span className="sq-badge sq-back">B</span>}
            </div>
          ))}
          {items.length === 0 && <div className="sq-empty">Queue is empty</div>}
        </div>
        <div className="queue-label">← BACK</div>
      </div>
      <div className="sq-info">
        <div className="sq-info-row"><span>Size:</span><span className="mono">{items.length}</span></div>
        <div className="sq-info-row"><span>Front:</span><span className="mono">{items.length > 0 ? items[0] : 'null'}</span></div>
        <div className="sq-info-row"><span>Back:</span><span className="mono">{items.length > 0 ? items[items.length - 1] : 'null'}</span></div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title={TYPES[type]?.label || 'Stack / Queue'}
      subtitle={type === 'stack' ? 'Last In, First Out — like a stack of plates' : 'First In, First Out — like a line at a cafe'}
      category="stackQueue"
      algoKey={type}
      controls={controls}
      visualization={visualization}
      stepDesc={stepDesc}
      code={code[type]}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={0}
      complexity={complexity[type]}
    />
  )
}
