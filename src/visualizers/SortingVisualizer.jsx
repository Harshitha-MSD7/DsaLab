import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Play, Pause, SkipBack, SkipForward,
  RotateCcw, Shuffle, ChevronLeft, ChevronRight
} from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import {
  bubbleSortSteps, mergeSortSteps, quickSortSteps,
  heapSortSteps, radixSortSteps,
  sortingCode, sortingComplexity
} from '../utils/sortingAlgorithms'
import './SortingVisualizer.css'

const ALGOS = {
  bubble: { label: 'Bubble Sort',  fn: bubbleSortSteps },
  merge:  { label: 'Merge Sort',   fn: mergeSortSteps  },
  quick:  { label: 'Quick Sort',   fn: quickSortSteps  },
  heap:   { label: 'Heap Sort',    fn: heapSortSteps   },
  radix:  { label: 'Radix Sort',   fn: radixSortSteps  },
}

const ALGO_LIST = Object.keys(ALGOS)

const STATE_COLORS = {
  comparing: 'var(--orange)',
  swapping:  'var(--pink)',
  sorted:    'var(--emerald)',
  current:   'var(--purple)',
  pivot:     'var(--rose)',
  default:   'var(--indigo)',
}

function randomArray(size = 16) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10)
}

export default function SortingVisualizer() {
  const { algo = 'bubble' } = useParams()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('java')
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [inputVal, setInputVal] = useState('64, 34, 25, 12, 22, 11, 90')
  const [arraySize, setArraySize] = useState(16)
  const intervalRef = useRef(null)

  const algoKey = ALGO_LIST.includes(algo) ? algo : 'bubble'

  const generateSteps = useCallback((arr) => {
    const fn = ALGOS[algoKey].fn
    const s = fn(arr)
    setSteps(s)
    setStepIdx(0)
    setPlaying(false)
  }, [algoKey])

  useEffect(() => {
    const arr = randomArray(arraySize)
    generateSteps(arr)
  }, [algoKey, generateSteps])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i >= steps.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }, speed)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, speed, steps.length])

  const current = steps[stepIdx] || { array: [], highlights: {}, desc: '', swaps: 0, comparisons: 0 }

  function handleCustomInput() {
    try {
      const arr = inputVal.split(',').map(s => {
        const n = parseInt(s.trim())
        if (isNaN(n) || n < 1 || n > 999) throw new Error()
        return n
      })
      if (arr.length < 2 || arr.length > 30) throw new Error()
      generateSteps(arr)
    } catch {
      alert('Please enter 2-30 comma-separated numbers (1-999)')
    }
  }

  function handleShuffle() {
    const arr = randomArray(arraySize)
    generateSteps(arr)
  }

  const maxVal = Math.max(...(current.array || [1]), 1)

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {/* Algorithm tabs */}
      <div className="algo-tabs">
        {ALGO_LIST.map(k => (
          <button
            key={k}
            className={`algo-tab ${k === algoKey ? 'active' : ''}`}
            onClick={() => navigate(`/sorting/${k}`)}
          >
            {ALGOS[k].label}
          </button>
        ))}
      </div>

      {/* Playback row */}
      <div className="playback-controls">
        <button className="btn btn-ghost btn-icon tooltip-container" onClick={() => { setStepIdx(0); setPlaying(false) }}>
          <SkipBack size={16} />
          <span className="tooltip">Reset</span>
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
        <button className="btn btn-ghost btn-icon tooltip-container" onClick={() => { setStepIdx(steps.length - 1); setPlaying(false) }}>
          <SkipForward size={16} />
          <span className="tooltip">Jump to end</span>
        </button>

        <span className="step-counter">{stepIdx + 1} / {steps.length}</span>

        <div className="speed-control">
          <span className="speed-label">Speed</span>
          <input type="range" min={50} max={1000} step={50}
            value={1050 - speed}
            onChange={e => setSpeed(1050 - Number(e.target.value))}
            style={{ width: 80 }}
          />
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--pink)' }}>{current.swaps ?? 0}</span>
            <span className="stat-label">Swaps</span>
          </div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--cyan)' }}>{current.comparisons ?? 0}</span>
            <span className="stat-label">Compares</span>
          </div>
        </div>
      </div>

      {/* Custom input row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text" value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="e.g. 64, 34, 25, 12"
          style={{ flex: 1, minWidth: 160 }}
        />
        <button className="btn btn-secondary" onClick={handleCustomInput}>Apply</button>
        <button className="btn btn-ghost btn-icon tooltip-container" onClick={handleShuffle}>
          <Shuffle size={16} />
          <span className="tooltip">Random array</span>
        </button>
        <select value={arraySize} onChange={e => { setArraySize(+e.target.value); handleShuffle() }}>
          {[8, 12, 16, 20, 24].map(n => <option key={n} value={n}>{n} elements</option>)}
        </select>
      </div>
    </div>
  )

  const visualization = (
    <div className="sort-canvas">
      <div className="sort-bars">
        {current.array.map((val, i) => {
          const state = current.highlights?.[i] || 'default'
          const color = STATE_COLORS[state] || STATE_COLORS.default
          const heightPct = (val / maxVal) * 100
          return (
            <div key={i} className="sort-bar-wrap">
              <div
                className={`sort-bar ${state}`}
                style={{
                  height: `${heightPct}%`,
                  background: color,
                  boxShadow: state !== 'default' ? `0 0 12px ${color}88` : 'none',
                }}
              >
                {current.array.length <= 20 && (
                  <span className="sort-bar-label">{val}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="sort-legend">
        {Object.entries(STATE_COLORS).map(([state, color]) => (
          <div key={state} className="sort-legend-item">
            <div className="sort-legend-dot" style={{ background: color }} />
            <span>{state}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title={ALGOS[algoKey].label}
      subtitle="Compare, swap, and sort — watch every step"
      category="sorting"
      algoKey={algoKey}
      controls={controls}
      visualization={visualization}
      stepDesc={current.desc}
      code={sortingCode[algoKey]}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={current.codeLine}
      complexity={sortingComplexity[algoKey]}
    />
  )
}
