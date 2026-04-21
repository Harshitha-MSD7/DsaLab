import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import './DPVisualizer.css'

const ALGOS = {
  fibonacci: { label: 'Fibonacci (Memoization)' },
  lcs:       { label: 'Longest Common Subsequence' },
  knapsack:  { label: '0/1 Knapsack' },
}

// ─── Fibonacci steps ──────────────────────────────────────────────────────────
function fibSteps(n) {
  const steps = []
  const memo = {}
  steps.push({ memo: {}, calling: null, desc: `Compute fib(${n})`, codeLine: 0 })

  function fib(k) {
    if (k <= 1) {
      memo[k] = k
      steps.push({ memo: { ...memo }, calling: k, desc: `fib(${k}) = ${k} (base case)`, codeLine: 1 })
      return k
    }
    if (memo[k] !== undefined) {
      steps.push({ memo: { ...memo }, calling: k, desc: `fib(${k}) = ${memo[k]} (cached! ✓)`, codeLine: 2, cached: true })
      return memo[k]
    }
    steps.push({ memo: { ...memo }, calling: k, desc: `Computing fib(${k}) = fib(${k-1}) + fib(${k-2})`, codeLine: 3 })
    const result = fib(k - 1) + fib(k - 2)
    memo[k] = result
    steps.push({ memo: { ...memo }, calling: k, desc: `fib(${k}) = ${result}, stored in memo`, codeLine: 4 })
    return result
  }

  fib(Math.min(n, 10))
  steps.push({ memo: { ...memo }, calling: null, desc: `Done! fib(${Math.min(n, 10)}) = ${memo[Math.min(n, 10)]}`, codeLine: 6 })
  return steps
}

// ─── LCS steps ────────────────────────────────────────────────────────────────
function lcsSteps(s1, s2) {
  const m = s1.length, n = s2.length
  const steps = []
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  steps.push({ dp: dp.map(r => [...r]), cell: null, desc: `Init DP table for "${s1}" vs "${s2}"`, codeLine: 0 })

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
        steps.push({ dp: dp.map(r => [...r]), cell: [i, j], match: true,
          desc: `s1[${i-1}]='${s1[i-1]}' == s2[${j-1}]='${s2[j-1]}' → dp[${i}][${j}] = dp[${i-1}][${j-1}]+1 = ${dp[i][j]}`,
          codeLine: 3 })
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        steps.push({ dp: dp.map(r => [...r]), cell: [i, j], match: false,
          desc: `s1[${i-1}]='${s1[i-1]}' ≠ s2[${j-1}]='${s2[j-1]}' → dp[${i}][${j}] = max(${dp[i-1][j]},${dp[i][j-1]}) = ${dp[i][j]}`,
          codeLine: 5 })
      }
    }
  }

  steps.push({ dp: dp.map(r => [...r]), cell: null,
    desc: `LCS length = dp[${m}][${n}] = ${dp[m][n]}`, codeLine: 7 })
  return steps
}

// ─── Knapsack steps ───────────────────────────────────────────────────────────
function knapsackSteps(weights, values, capacity) {
  const n = weights.length
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0))
  const steps = []

  steps.push({ dp: dp.map(r => [...r]), cell: null, desc: 'Init DP table (rows=items, cols=capacity)', codeLine: 0 })

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]])
        const took = values[i - 1] + dp[i - 1][w - weights[i - 1]] > dp[i - 1][w]
        steps.push({ dp: dp.map(r => [...r]), cell: [i, w],
          desc: `Item ${i} (w=${weights[i-1]},v=${values[i-1]}): ${took ? `take it! val=${dp[i][w]}` : `skip. val=${dp[i][w]}`}`,
          codeLine: took ? 4 : 3 })
      } else {
        dp[i][w] = dp[i - 1][w]
        steps.push({ dp: dp.map(r => [...r]), cell: [i, w],
          desc: `Item ${i} too heavy for cap ${w}, skip. dp[${i}][${w}]=${dp[i][w]}`,
          codeLine: 2 })
      }
    }
  }

  steps.push({ dp: dp.map(r => [...r]), cell: null, desc: `Max value = dp[${n}][${capacity}] = ${dp[n][capacity]}`, codeLine: 6 })
  return steps
}

const code = {
  fibonacci: {
    python: [
      'def fib(n, memo={}):',
      '    if n <= 1: return n        # base case',
      '    if n in memo: return memo[n] # cached',
      '    memo[n] = fib(n-1) + fib(n-2)',
      '    return memo[n]',
      '',
      '# Without memo: O(2^n). With memo: O(n)!',
    ],
    java: [
      'Map<Integer,Long> memo = new HashMap<>();',
      '',
      'long fib(int n) {',
      '    if (n <= 1) return n;',
      '    if (memo.containsKey(n)) return memo.get(n);',
      '    long result = fib(n-1) + fib(n-2);',
      '    memo.put(n, result);',
      '    return result;',
      '}',
      '// O(n) time, O(n) space',
    ],
    cpp: [
      'unordered_map<int,long long> memo;',
      '',
      'long long fib(int n) {',
      '    if (n <= 1) return n;',
      '    if (memo.count(n)) return memo[n];',
      '    return memo[n] = fib(n-1) + fib(n-2);',
      '}',
      '// O(n) with memoization vs O(2^n) naive',
    ],
  },
  lcs: {
    python: [
      'def lcs(s1, s2):',
      '    m, n = len(s1), len(s2)',
      '    dp = [[0]*(n+1) for _ in range(m+1)]',
      '    for i in range(1, m+1):',
      '        for j in range(1, n+1):',
      '            if s1[i-1] == s2[j-1]:',
      '                dp[i][j] = dp[i-1][j-1] + 1',
      '            else:',
      '                dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      '    return dp[m][n]',
      '# O(mn) time and space',
    ],
    java: [
      'int lcs(String s1, String s2) {',
      '    int m=s1.length(), n=s2.length();',
      '    int[][] dp = new int[m+1][n+1];',
      '    for (int i=1;i<=m;i++)',
      '        for (int j=1;j<=n;j++)',
      '            if (s1.charAt(i-1)==s2.charAt(j-1))',
      '                dp[i][j] = dp[i-1][j-1]+1;',
      '            else',
      '                dp[i][j] = Math.max(dp[i-1][j],dp[i][j-1]);',
      '    return dp[m][n];',
      '}',
    ],
    cpp: [
      'int lcs(string s1, string s2) {',
      '    int m=s1.size(), n=s2.size();',
      '    vector<vector<int>> dp(m+1, vector<int>(n+1,0));',
      '    for(int i=1;i<=m;i++)',
      '        for(int j=1;j<=n;j++)',
      '            dp[i][j]=s1[i-1]==s2[j-1]',
      '                ? dp[i-1][j-1]+1',
      '                : max(dp[i-1][j],dp[i][j-1]);',
      '    return dp[m][n];',
      '}',
    ],
  },
  knapsack: {
    python: [
      'def knapsack(weights, values, W):',
      '    n = len(weights)',
      '    dp = [[0]*(W+1) for _ in range(n+1)]',
      '    for i in range(1, n+1):',
      '        for w in range(W+1):',
      '            if weights[i-1] > w:',
      '                dp[i][w] = dp[i-1][w]',
      '            else:',
      '                dp[i][w] = max(dp[i-1][w],',
      '                    values[i-1] + dp[i-1][w-weights[i-1]])',
      '    return dp[n][W]',
      '# O(nW) time and space',
    ],
    java: [
      'int knapsack(int[] w, int[] v, int W) {',
      '    int n=w.length;',
      '    int[][] dp = new int[n+1][W+1];',
      '    for (int i=1;i<=n;i++)',
      '        for (int c=0;c<=W;c++)',
      '            if (w[i-1]>c) dp[i][c]=dp[i-1][c];',
      '            else dp[i][c]=Math.max(dp[i-1][c],',
      '                v[i-1]+dp[i-1][c-w[i-1]]);',
      '    return dp[n][W];',
      '}',
    ],
    cpp: [
      'int knapsack(vector<int>& w, vector<int>& v, int W) {',
      '    int n=w.size();',
      '    vector<vector<int>> dp(n+1, vector<int>(W+1,0));',
      '    for(int i=1;i<=n;i++)',
      '        for(int c=0;c<=W;c++)',
      '            dp[i][c]=w[i-1]>c ? dp[i-1][c]',
      '                : max(dp[i-1][c],v[i-1]+dp[i-1][c-w[i-1]]);',
      '    return dp[n][W];',
      '}',
    ],
  },
}

const complexity = {
  fibonacci: { time: 'O(n)', space: 'O(n)', notes: 'Naive recursion is O(2^n). Memoization reduces to O(n) by caching subproblems.' },
  lcs:       { time: 'O(mn)', space: 'O(mn)', notes: 'm,n = string lengths. Fill an m×n table bottom-up.' },
  knapsack:  { time: 'O(nW)', space: 'O(nW)', notes: 'n = items, W = capacity. Pseudo-polynomial time.' },
}

export default function DPVisualizer() {
  const { algo = 'fibonacci' } = useParams()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('java')
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(600)
  const [fibN, setFibN] = useState(8)
  const [lcsS1, setLcsS1] = useState('ABCBDAB')
  const [lcsS2, setLcsS2] = useState('BDCAB')
  const intervalRef = useRef(null)

  const algoKey = Object.keys(ALGOS).includes(algo) ? algo : 'fibonacci'

  function generate() {
    let s = []
    if (algoKey === 'fibonacci') s = fibSteps(fibN)
    else if (algoKey === 'lcs')  s = lcsSteps(lcsS1.slice(0, 6), lcsS2.slice(0, 6))
    else s = knapsackSteps([2,3,4,5],[3,4,5,7], 7)
    setSteps(s)
    setStepIdx(0)
    setPlaying(false)
  }

  useEffect(() => { generate() }, [algoKey, fibN, lcsS1, lcsS2])

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

  const current = steps[stepIdx] || {}

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div className="algo-tabs">
        {Object.entries(ALGOS).map(([k, v]) => (
          <button key={k} className={`algo-tab ${k === algoKey ? 'active' : ''}`}
            onClick={() => navigate(`/dp/${k}`)}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {algoKey === 'fibonacci' && (
          <>
            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>n =</label>
            <input type="number" value={fibN} onChange={e => setFibN(Math.min(12, Math.max(1, +e.target.value)))}
              min={1} max={12} style={{ width: 70 }} />
          </>
        )}
        {algoKey === 'lcs' && (
          <>
            <input type="text" value={lcsS1} onChange={e => setLcsS1(e.target.value.slice(0, 6).toUpperCase())}
              placeholder="String 1" style={{ width: 90 }} />
            <input type="text" value={lcsS2} onChange={e => setLcsS2(e.target.value.slice(0, 6).toUpperCase())}
              placeholder="String 2" style={{ width: 90 }} />
          </>
        )}
        <div className="playback-controls">
          <button className="btn btn-ghost btn-icon" onClick={() => { setStepIdx(0); setPlaying(false) }}>
            <RotateCcw size={16} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => setStepIdx(i => Math.max(0, i-1))} disabled={stepIdx === 0}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn btn-primary btn-icon" onClick={() => setPlaying(p => !p)} disabled={stepIdx >= steps.length - 1}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => setStepIdx(i => Math.min(steps.length - 1, i+1))} disabled={stepIdx >= steps.length - 1}>
            <ChevronRight size={16} />
          </button>
          <span className="step-counter">{stepIdx + 1}/{steps.length}</span>
          <div className="speed-control">
            <span className="speed-label">Speed</span>
            <input type="range" min={100} max={1500} step={100} value={1600 - speed}
              onChange={e => setSpeed(1600 - +e.target.value)} style={{ width: 70 }} />
          </div>
        </div>
      </div>
    </div>
  )

  // Fibonacci visualization: memo table
  const fibViz = (
    <div className="dp-canvas">
      <div className="dp-memo-grid">
        {Object.entries(current.memo || {}).sort(([a],[b]) => +a - +b).map(([k, v]) => (
          <div key={k} className={`dp-memo-cell ${+k === current.calling ? 'active' : ''}`}>
            <div className="dp-memo-key">fib({k})</div>
            <div className="dp-memo-val">{v}</div>
          </div>
        ))}
      </div>
      {current.cached && (
        <div className="dp-cache-badge">⚡ Cache hit! No recomputation needed</div>
      )}
    </div>
  )

  // Table visualization for LCS / Knapsack
  function tableViz(rowLabels, colLabels) {
    const dp = current.dp || []
    if (!dp.length) return null
    const [activeRow, activeCol] = current.cell || [-1, -1]
    return (
      <div className="dp-canvas">
        <div className="dp-table-wrap">
          <table className="dp-table">
            <thead>
              <tr>
                <th />
                {colLabels.map((l, j) => <th key={j} className="dp-col-header">{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td className="dp-row-header">{rowLabels[i]}</td>
                  {row.map((val, j) => (
                    <td key={j} className={`dp-cell ${i === activeRow && j === activeCol ? (current.match ? 'dp-match' : 'dp-active') : val > 0 ? 'dp-filled' : ''}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  let visualization = null
  if (algoKey === 'fibonacci') visualization = fibViz
  else if (algoKey === 'lcs') {
    const rowLabels = ['', ...lcsS1.slice(0,6).split('')]
    const colLabels = ['', ...lcsS2.slice(0,6).split('')]
    visualization = tableViz(rowLabels, colLabels)
  } else {
    const rowLabels = ['0', '1(w=2)', '2(w=3)', '3(w=4)', '4(w=5)']
    const colLabels = Array.from({ length: 8 }, (_, i) => i)
    visualization = tableViz(rowLabels, colLabels)
  }

  return (
    <VisualizerLayout
      title={ALGOS[algoKey].label}
      subtitle="Break problems into overlapping subproblems, solve each once"
      category="dp"
      algoKey={algoKey}
      controls={controls}
      visualization={visualization}
      stepDesc={current.desc}
      code={code[algoKey]}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={current.codeLine}
      complexity={complexity[algoKey]}
    />
  )
}
