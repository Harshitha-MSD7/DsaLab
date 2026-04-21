import { Link } from 'react-router-dom'
import {
  BarChart2, GitBranch, Share2, List, Layers,
  Hash, Search, Brain, Zap, Trophy, BookOpen,
  TrendingUp, Star, ArrowRight, Play
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Home.css'

const topics = [
  {
    label: 'Sorting', icon: BarChart2, color: 'var(--purple)', bg: 'rgba(139,92,246,0.1)',
    path: '/sorting/bubble',
    desc: 'Bubble, Merge, Quick, Heap, Radix',
    complexity: 'O(n log n) — O(n²)',
    count: 5,
  },
  {
    label: 'Trees', icon: GitBranch, color: 'var(--cyan)', bg: 'rgba(6,182,212,0.1)',
    path: '/trees/bst',
    desc: 'BST, AVL, Min/Max Heap',
    complexity: 'O(log n) — O(n)',
    count: 3,
  },
  {
    label: 'Graphs', icon: Share2, color: 'var(--pink)', bg: 'rgba(236,72,153,0.1)',
    path: '/graphs/bfs',
    desc: 'BFS, DFS, Dijkstra, Bellman-Ford',
    complexity: 'O(V + E)',
    count: 4,
  },
  {
    label: 'Linked Lists', icon: List, color: 'var(--lime)', bg: 'rgba(132,204,22,0.1)',
    path: '/linked-list/singly',
    desc: 'Singly and Doubly linked',
    complexity: 'O(n)',
    count: 2,
  },
  {
    label: 'Stack & Queue', icon: Layers, color: 'var(--orange)', bg: 'rgba(249,115,22,0.1)',
    path: '/stack-queue/stack',
    desc: 'LIFO and FIFO structures',
    complexity: 'O(1)',
    count: 2,
  },
  {
    label: 'Hash Map', icon: Hash, color: 'var(--yellow)', bg: 'rgba(234,179,8,0.1)',
    path: '/hashmap',
    desc: 'Key-value storage with chaining',
    complexity: 'O(1) average',
    count: 1,
  },
  {
    label: 'Binary Search', icon: Search, color: 'var(--teal)', bg: 'rgba(20,184,166,0.1)',
    path: '/search',
    desc: 'Divide and conquer searching',
    complexity: 'O(log n)',
    count: 1,
  },
  {
    label: 'Dynamic Programming', icon: Brain, color: 'var(--rose)', bg: 'rgba(244,63,94,0.1)',
    path: '/dp/fibonacci',
    desc: 'Fibonacci, LCS, Knapsack',
    complexity: 'Varies',
    count: 3,
  },
]

const features = [
  {
    icon: Play,
    title: 'Step-by-Step Animations',
    desc: 'Play, pause, step forward/back with speed control. Watch every swap, comparison, and traversal unfold visually.',
    color: 'var(--purple)',
  },
  {
    icon: BookOpen,
    title: 'Multi-Language Code',
    desc: 'See highlighted pseudocode in Python, Java, and C++ with the current line synced to the animation.',
    color: 'var(--cyan)',
  },
  {
    icon: Trophy,
    title: 'Quiz Mode',
    desc: 'Predict the next step before it happens. Test your understanding and earn streaks!',
    color: 'var(--pink)',
  },
  {
    icon: TrendingUp,
    title: 'Complexity Panel',
    desc: 'Time & space Big-O for every algorithm, plus an explanation card per step explaining the "why".',
    color: 'var(--lime)',
  },
  {
    icon: Star,
    title: 'Progress Tracking',
    desc: 'Track which algorithms you\'ve mastered. Your progress is saved automatically.',
    color: 'var(--orange)',
  },
  {
    icon: Zap,
    title: 'Custom Input',
    desc: 'Input your own arrays, graphs, and trees. See exactly how algorithms behave on your data.',
    color: 'var(--yellow)',
  },
]

export default function Home() {
  const { getTotalProgress } = useApp()
  const { done, total, pct } = getTotalProgress()

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            <span>Interactive DSA Learning</span>
          </div>
          <h1 className="hero-title">
            Master Data Structures<br />
            <span className="gradient-text">&amp; Algorithms</span>
          </h1>
          <p className="hero-desc">
            Visualize every step, understand every concept. Beautiful animations,
            multi-language code, quiz mode, and progress tracking — all in one place.
          </p>
          <div className="hero-cta">
            <Link to="/sorting/bubble" className="btn btn-primary hero-btn-primary">
              <Play size={16} /> Start Visualizing
            </Link>
            <Link to="/dp/fibonacci" className="btn btn-secondary hero-btn-secondary">
              <Brain size={16} /> Try DP Visualizer
            </Link>
          </div>
        </div>

        {/* Floating demo bars */}
        <div className="hero-demo" aria-hidden>
          {[65, 30, 85, 45, 70, 20, 90, 55, 40, 75].map((h, i) => (
            <div
              key={i}
              className="hero-bar"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.12}s`,
                background: `hsl(${240 + i * 15}, 80%, 65%)`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Progress summary */}
      {done > 0 && (
        <section className="home-section">
          <div className="progress-summary card">
            <div className="progress-summary-left">
              <Trophy size={20} style={{ color: 'var(--yellow)' }} />
              <div>
                <div className="progress-summary-title">Your Progress</div>
                <div className="progress-summary-sub">{done} of {total} algorithms explored</div>
              </div>
            </div>
            <div className="progress-summary-right">
              <div className="progress-bar" style={{ width: 200 }}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="progress-summary-pct">{pct}%</span>
            </div>
          </div>
        </section>
      )}

      {/* Topics grid */}
      <section className="home-section">
        <h2 className="section-title">Topics</h2>
        <div className="topics-grid">
          {topics.map(t => {
            const Icon = t.icon
            return (
              <Link key={t.path} to={t.path} className="topic-card" style={{ '--topic-color': t.color, '--topic-bg': t.bg }}>
                <div className="topic-icon-wrap">
                  <Icon size={22} />
                </div>
                <div className="topic-info">
                  <div className="topic-label">{t.label}</div>
                  <div className="topic-desc">{t.desc}</div>
                  <div className="topic-meta">
                    <span className="tag tag-purple" style={{ background: t.bg, color: t.color }}>
                      {t.count} {t.count === 1 ? 'algo' : 'algos'}
                    </span>
                    <span className="topic-complexity mono">{t.complexity}</span>
                  </div>
                </div>
                <ArrowRight size={16} className="topic-arrow" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <h2 className="section-title">What You Get</h2>
        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="feature-card card" style={{ '--f-color': f.color }}>
                <div className="feature-icon">
                  <Icon size={20} />
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
