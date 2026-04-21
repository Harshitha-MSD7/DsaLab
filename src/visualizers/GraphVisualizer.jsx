import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import {
  bfsSteps, dfsSteps, dijkstraSteps, bellmanFordSteps,
  graphCode, graphComplexity, defaultGraph
} from '../utils/graphAlgorithms'
import './GraphVisualizer.css'

const ALGOS = {
  bfs:         { label: 'BFS',          fn: 'bfs',    weighted: false },
  dfs:         { label: 'DFS',          fn: 'dfs',    weighted: false },
  dijkstra:    { label: 'Dijkstra',     fn: 'dij',    weighted: true  },
  'bellman-ford': { label: 'Bellman-Ford', fn: 'bf',  weighted: true  },
}

const STATE_COLORS = {
  default:    'var(--surface-2)',
  visited:    'var(--cyan)',
  current:    'var(--purple)',
  comparing:  'var(--orange)',
  path:       'var(--yellow)',
  sorted:     'var(--emerald)',
}

export default function GraphVisualizer() {
  const { algo = 'bfs' } = useParams()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('java')
  const svgRef = useRef(null)
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(700)
  const [startNode, setStartNode] = useState(0)
  const intervalRef = useRef(null)

  const algoKey = Object.keys(ALGOS).includes(algo) ? algo : 'bfs'

  function generateSteps(start = startNode) {
    const g = defaultGraph
    let s = []
    if (algoKey === 'bfs')          s = bfsSteps(g.unweighted, start)
    else if (algoKey === 'dfs')     s = dfsSteps(g.unweighted, start)
    else if (algoKey === 'dijkstra') s = dijkstraSteps(g.adjacency, start)
    else s = bellmanFordSteps(g.adjacency, start, g.edges)
    setSteps(s)
    setStepIdx(0)
    setPlaying(false)
  }

  useEffect(() => { generateSteps() }, [algoKey])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i >= steps.length - 1) { setPlaying(false); return i }
          return i + 1
        })
      }, speed)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, steps.length])

  const currentStep = steps[stepIdx] || {}

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const w = svgRef.current.clientWidth || 560
    const h = 300
    svg.attr('viewBox', `0 0 ${w} ${h}`)
    const positions = defaultGraph.positions
    const scaleX = w / 560
    const g = svg.append('g')

    const hl = currentStep.highlights || {}

    // Draw edges
    defaultGraph.edges.forEach(([u, v, w]) => {
      const p1 = positions[u], p2 = positions[v]
      const mx = (p1.x + p2.x) / 2 * scaleX
      const my = (p1.y + p2.y) / 2

      g.append('line')
        .attr('x1', p1.x * scaleX).attr('y1', p1.y)
        .attr('x2', p2.x * scaleX).attr('y2', p2.y)
        .attr('class', 'graph-edge')
        .style('stroke', (hl[u] === 'visited' && hl[v] === 'visited') ? 'var(--cyan)' : '#374151')
        .style('stroke-width', 2)
        .style('opacity', 0.7)

      if (ALGOS[algoKey]?.weighted) {
        g.append('text')
          .attr('x', mx).attr('y', my - 6)
          .attr('class', 'graph-edge-label')
          .text(w)
      }
    })

    // Draw nodes
    Object.entries(positions).forEach(([id, pos]) => {
      const state = hl[parseInt(id)] || 'default'
      const color = STATE_COLORS[state] || STATE_COLORS.default

      const nodeG = g.append('g')
        .attr('transform', `translate(${pos.x * scaleX},${pos.y})`)

      nodeG.append('circle')
        .attr('r', 22)
        .attr('class', 'graph-node')
        .style('fill', color)
        .style('stroke', state !== 'default' ? color : '#4b5563')
        .style('stroke-width', 2)
        .style('filter', state !== 'default' ? `drop-shadow(0 0 8px ${color})` : 'none')

      nodeG.append('text')
        .attr('text-anchor', 'middle').attr('dy', '0.35em')
        .attr('class', 'graph-node-label')
        .text(id)

      // Show dist label for Dijkstra/Bellman-Ford
      if (currentStep.dist && currentStep.dist[id] !== undefined) {
        const d = currentStep.dist[id]
        nodeG.append('text')
          .attr('y', -28).attr('text-anchor', 'middle')
          .attr('class', 'graph-dist-label')
          .text(d === Infinity ? '∞' : d)
      }
    })
  }, [currentStep, algoKey, svgRef])

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div className="algo-tabs">
        {Object.entries(ALGOS).map(([k, v]) => (
          <button key={k} className={`algo-tab ${k === algoKey ? 'active' : ''}`}
            onClick={() => navigate(`/graphs/${k}`)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="playback-controls">
        <button className="btn btn-ghost btn-icon" onClick={() => { setStepIdx(0); setPlaying(false) }}>
          <RotateCcw size={16} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx === 0}>
          <ChevronLeft size={16} />
        </button>
        <button className="btn btn-primary btn-icon" onClick={() => setPlaying(p => !p)} disabled={stepIdx >= steps.length - 1}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} disabled={stepIdx >= steps.length - 1}>
          <ChevronRight size={16} />
        </button>
        <span className="step-counter">{stepIdx + 1} / {steps.length}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="speed-label">Start node:</span>
          <select value={startNode} onChange={e => { setStartNode(+e.target.value); generateSteps(+e.target.value) }}>
            {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="speed-control">
          <span className="speed-label">Speed</span>
          <input type="range" min={100} max={1200} step={100}
            value={1300 - speed} onChange={e => setSpeed(1300 - +e.target.value)}
            style={{ width: 70 }}
          />
        </div>
      </div>
    </div>
  )

  const visualization = (
    <div className="graph-canvas">
      <svg ref={svgRef} className="graph-svg" />
      {currentStep.path && currentStep.path.length > 0 && (
        <div className="graph-path-bar">
          <span className="graph-path-label">Visit order:</span>
          {currentStep.path.map((n, i) => (
            <span key={i} className="graph-path-node">
              {n}{i < currentStep.path.length - 1 && <span className="graph-arrow">→</span>}
            </span>
          ))}
        </div>
      )}
      <div className="graph-legend">
        {Object.entries(STATE_COLORS).map(([s, c]) => (
          <div key={s} className="sort-legend-item">
            <div className="sort-legend-dot" style={{ background: c, borderRadius: '50%' }} />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title={ALGOS[algoKey].label}
      subtitle={ALGOS[algoKey].weighted ? 'Weighted directed graph' : 'Unweighted undirected graph'}
      category="graphs"
      algoKey={algoKey.replace('-', '')}
      controls={controls}
      visualization={visualization}
      stepDesc={currentStep.desc}
      code={graphCode[algoKey === 'bellman-ford' ? 'bfs' : algoKey]}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={currentStep.codeLine}
      complexity={graphComplexity[algoKey === 'bellman-ford' ? 'bellmanFord' : algoKey]}
    />
  )
}
