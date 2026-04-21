import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import './BinarySearchVisualizer.css'

function binarySearchSteps(arr, target) {
  const steps = []
  let lo = 0, hi = arr.length - 1

  steps.push({ lo, hi, mid: null, found: -1, desc: `Search for ${target} in sorted array`, codeLine: 0 })

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    steps.push({ lo, hi, mid, found: -1, desc: `mid = (${lo}+${hi})/2 = ${mid}, arr[${mid}] = ${arr[mid]}`, codeLine: 2 })

    if (arr[mid] === target) {
      steps.push({ lo, hi, mid, found: mid, desc: `Found! arr[${mid}] = ${target}`, codeLine: 3 })
      return steps
    } else if (arr[mid] < target) {
      steps.push({ lo, hi, mid, found: -1, desc: `${arr[mid]} < ${target}: search right half, lo = ${mid + 1}`, codeLine: 5 })
      lo = mid + 1
    } else {
      steps.push({ lo, hi, mid, found: -1, desc: `${arr[mid]} > ${target}: search left half, hi = ${mid - 1}`, codeLine: 7 })
      hi = mid - 1
    }
  }

  steps.push({ lo, hi, mid: null, found: -2, desc: `${target} not found in array`, codeLine: 9 })
  return steps
}

const DEFAULT_ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]

const code = {
  python: [
    'def binary_search(arr, target):',
    '    lo, hi = 0, len(arr) - 1',
    '    while lo <= hi:',
    '        mid = (lo + hi) // 2',
    '        if arr[mid] == target: return mid',
    '        elif arr[mid] < target:',
    '            lo = mid + 1    # search right',
    '        else:',
    '            hi = mid - 1   # search left',
    '    return -1  # not found',
  ],
  java: [
    'int binarySearch(int[] arr, int target) {',
    '    int lo = 0, hi = arr.length - 1;',
    '    while (lo <= hi) {',
    '        int mid = lo + (hi - lo) / 2;',
    '        if (arr[mid] == target) return mid;',
    '        else if (arr[mid] < target)',
    '            lo = mid + 1;  // search right',
    '        else',
    '            hi = mid - 1;  // search left',
    '    }',
    '    return -1; // not found',
    '}',
  ],
  cpp: [
    'int binarySearch(int arr[], int n, int target) {',
    '    int lo=0, hi=n-1;',
    '    while (lo<=hi) {',
    '        int mid=lo+(hi-lo)/2;',
    '        if (arr[mid]==target) return mid;',
    '        else if (arr[mid]<target)',
    '            lo=mid+1;',
    '        else',
    '            hi=mid-1;',
    '    }',
    '    return -1;',
    '}',
  ],
}

const complexity = {
  time: 'O(log n)',
  best: 'O(1)',
  space: 'O(1)',
  notes: 'Array must be sorted. Each step halves the search space. 1 billion elements → max 30 comparisons!',
}

export default function BinarySearchVisualizer() {
  const [language, setLanguage] = useState('java')
  const [arr, setArr] = useState(DEFAULT_ARR)
  const [target, setTarget] = useState(23)
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(700)
  const intervalRef = useRef(null)

  useEffect(() => {
    const s = binarySearchSteps(arr, target)
    setSteps(s)
    setStepIdx(0)
    setPlaying(false)
  }, [arr, target])

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

  const current = steps[stepIdx] || { lo: 0, hi: arr.length - 1, mid: null, found: -1 }

  const controls = (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <input type="number" defaultValue={target} onBlur={e => setTarget(+e.target.value)}
        placeholder="Target..." style={{ width: 90 }} />
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
        <div className="speed-control">
          <span className="speed-label">Speed</span>
          <input type="range" min={100} max={1400} step={100} value={1500 - speed}
            onChange={e => setSpeed(1500 - +e.target.value)} style={{ width: 70 }} />
        </div>
      </div>
    </div>
  )

  const visualization = (
    <div className="bs-canvas">
      {/* Array visualization */}
      <div className="bs-array">
        {arr.map((val, i) => {
          let state = 'default'
          if (i === current.found) state = 'found'
          else if (current.found === -2) state = 'notfound'
          else if (i === current.mid) state = 'mid'
          else if (i < current.lo || i > current.hi) state = 'eliminated'
          else state = 'active'

          return (
            <div key={i} className={`bs-cell bs-${state}`}>
              <div className="bs-val">{val}</div>
              <div className="bs-idx">{i}</div>
              {i === current.lo  && <div className="bs-ptr bs-ptr-lo">lo</div>}
              {i === current.hi  && <div className="bs-ptr bs-ptr-hi">hi</div>}
              {i === current.mid && <div className="bs-ptr bs-ptr-mid">mid</div>}
            </div>
          )
        })}
      </div>

      {/* Target */}
      <div className="bs-target">
        Searching for: <span className="bs-target-val">{target}</span>
      </div>

      {/* Legend */}
      <div className="sort-legend">
        {[['active','Search range'],['mid','Mid point'],['found','Found!'],['eliminated','Eliminated'],['notfound','Not found']].map(([s,l]) => (
          <div key={s} className="sort-legend-item">
            <div className={`bs-legend-dot bs-${s}`} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title="Binary Search"
      subtitle="Divide and conquer — halve the search space each step"
      category="search"
      algoKey="binary"
      controls={controls}
      visualization={visualization}
      stepDesc={current.desc}
      code={code}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={current.codeLine}
      complexity={complexity}
    />
  )
}
