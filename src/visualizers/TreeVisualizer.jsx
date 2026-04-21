import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { Plus, Search, RotateCcw } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import {
  bstInsert, bstInsertSteps, bstSearchSteps,
  buildSampleBST, treeToD3,
  heapInsertSteps, treeCode, treeComplexity
} from '../utils/treeAlgorithms'
import './TreeVisualizer.css'

const TYPES = {
  bst:  { label: 'Binary Search Tree' },
  avl:  { label: 'AVL Tree (BST + balanced)' },
  heap: { label: 'Min-Heap' },
}

function useTreeD3(root, highlights = {}, svgRef) {
  useEffect(() => {
    if (!svgRef.current || !root) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const w = svgRef.current.clientWidth || 560
    const h = 300
    svg.attr('viewBox', `0 0 ${w} ${h}`)

    const hierarchy = d3.hierarchy(root)
    const treeLayout = d3.tree().size([w - 60, h - 80])
    treeLayout(hierarchy)

    const g = svg.append('g').attr('transform', 'translate(30,40)')

    // Links
    g.selectAll('line.link')
      .data(hierarchy.links())
      .enter().append('line')
      .attr('class', 'tree-link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)

    // Nodes
    const node = g.selectAll('g.node')
      .data(hierarchy.descendants())
      .enter().append('g')
      .attr('class', 'tree-node-g')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    const nodeColors = {
      highlighted: '#8b5cf6',
      found:       '#10b981',
      notFound:    '#f43f5e',
      inserted:    '#06b6d4',
      default:     '#1e1e40',
    }

    node.append('circle')
      .attr('r', 20)
      .attr('class', 'tree-node-circle')
      .style('fill', d => {
        const v = d.data.val
        if (highlights.highlighted === v) return nodeColors.highlighted
        if (highlights.found === v)       return nodeColors.found
        if (highlights.inserted === v)    return nodeColors.inserted
        return nodeColors.default
      })
      .style('stroke', d => {
        const v = d.data.val
        if (highlights.highlighted === v) return '#a78bfa'
        if (highlights.found === v)       return '#34d399'
        return '#374151'
      })

    node.append('text')
      .attr('class', 'tree-node-text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text(d => d.data.val)

  }, [root, highlights, svgRef])
}

export default function TreeVisualizer() {
  const { type = 'bst' } = useParams()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('java')
  const svgRef = useRef(null)

  // BST state
  const [bstRoot, setBstRoot] = useState(() => buildSampleBST())
  const [insertVal, setInsertVal] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [highlights, setHighlights] = useState({})
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [stepDesc, setStepDesc] = useState('')
  const [currentLine, setCurrentLine] = useState(0)

  // Heap state
  const [heap, setHeap] = useState([3, 5, 8, 10, 12, 15, 20])
  const [heapSteps, setHeapSteps] = useState([])
  const [heapStepIdx, setHeapStepIdx] = useState(0)

  const treeKey = Object.keys(TYPES).includes(type) ? type : 'bst'
  const d3Root = type !== 'heap' ? treeToD3(bstRoot) : null

  useTreeD3(d3Root, highlights, svgRef)

  function playStep(stepList, idx) {
    const step = stepList[idx]
    if (!step) return
    setHighlights({
      highlighted: step.highlight,
      inserted:    step.inserted,
      found:       step.found ? step.highlight : null,
    })
    setStepDesc(step.desc)
    setCurrentLine(step.codeLine || 0)
  }

  function handleInsert() {
    const v = parseInt(insertVal)
    if (isNaN(v)) return
    const s = bstInsertSteps(bstRoot, v)
    setSteps(s)
    setStepIdx(0)
    playStep(s, 0)
    // After animation, actually insert
    setTimeout(() => {
      setBstRoot(prev => bstInsert(prev, v))
      setHighlights({})
    }, s.length * 600 + 200)
    setInsertVal('')
  }

  function handleSearch() {
    const v = parseInt(searchVal)
    if (isNaN(v)) return
    const s = bstSearchSteps(bstRoot, v)
    setSteps(s)
    setStepIdx(0)
    s.forEach((step, i) => {
      setTimeout(() => playStep(s, i), i * 600)
    })
    setTimeout(() => setHighlights({}), s.length * 600 + 1000)
    setSearchVal('')
  }

  function handleReset() {
    setBstRoot(buildSampleBST())
    setHighlights({})
    setStepDesc('')
    setSteps([])
    setHeap([3, 5, 8, 10, 12, 15, 20])
  }

  function handleHeapInsert() {
    const v = parseInt(insertVal)
    if (isNaN(v)) return
    const { steps: s, heap: newHeap } = heapInsertSteps(heap, v)
    setHeapSteps(s)
    setHeapStepIdx(0)
    s.forEach((step, i) => {
      setTimeout(() => {
        setHeap(step.heap)
        setStepDesc(step.desc)
        setCurrentLine(step.codeLine)
      }, i * 500)
    })
    setTimeout(() => setHeap(newHeap), s.length * 500)
    setInsertVal('')
  }

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div className="algo-tabs">
        {Object.entries(TYPES).map(([k, v]) => (
          <button key={k} className={`algo-tab ${k === treeKey ? 'active' : ''}`}
            onClick={() => navigate(`/trees/${k}`)}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="number" value={insertVal}
          onChange={e => setInsertVal(e.target.value)}
          placeholder="Value..."
          style={{ width: 100 }}
          onKeyDown={e => e.key === 'Enter' && (type === 'heap' ? handleHeapInsert() : handleInsert())}
        />
        {type !== 'heap' && (
          <>
            <button className="btn btn-primary" onClick={handleInsert}>
              <Plus size={14} /> Insert
            </button>
            <button className="btn btn-secondary" onClick={handleSearch}>
              <Search size={14} /> Search
            </button>
            <input
              type="number" value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search..."
              style={{ width: 100 }}
            />
          </>
        )}
        {type === 'heap' && (
          <button className="btn btn-primary" onClick={handleHeapInsert}>
            <Plus size={14} /> Insert to Heap
          </button>
        )}
        <button className="btn btn-ghost btn-icon tooltip-container" onClick={handleReset}>
          <RotateCcw size={16} />
          <span className="tooltip">Reset</span>
        </button>
      </div>
    </div>
  )

  const visualization = type === 'heap' ? (
    <div className="heap-canvas">
      <div className="heap-array-label">Array representation:</div>
      <div className="heap-array">
        {heap.map((v, i) => (
          <div key={i} className="heap-cell">
            <div className="heap-cell-val">{v}</div>
            <div className="heap-cell-idx">{i}</div>
          </div>
        ))}
      </div>
      <div className="heap-tree">
        {heap.map((v, i) => {
          const left = 2 * i + 1
          const right = 2 * i + 2
          return (
            <div key={i} className="heap-node-wrap" style={{
              left:  `${(i % Math.pow(2, Math.floor(Math.log2(i + 1)))) / Math.pow(2, Math.floor(Math.log2(i + 1))) * 90 + 5}%`,
              top:   `${Math.floor(Math.log2(i + 1)) * 70 + 10}px`,
            }}>
              <div className={`heap-node ${i === 0 ? 'heap-root' : ''}`}>{v}</div>
            </div>
          )
        })}
      </div>
    </div>
  ) : (
    <div className="tree-canvas">
      <svg ref={svgRef} className="tree-svg" />
    </div>
  )

  return (
    <VisualizerLayout
      title={TYPES[treeKey].label}
      subtitle="Insert, search, and traverse — see the tree grow"
      category="trees"
      algoKey={treeKey}
      controls={controls}
      visualization={visualization}
      stepDesc={stepDesc}
      code={treeCode[treeKey === 'heap' ? 'heap' : 'bst']?.insert}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={currentLine}
      complexity={treeComplexity[treeKey]}
    />
  )
}
