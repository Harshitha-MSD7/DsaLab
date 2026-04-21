import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart2, GitBranch, Share2, List, Layers,
  Hash, Search, Brain, ChevronDown, ChevronRight,
  CheckCircle2, Circle
} from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import './Sidebar.css'

const navItems = [
  {
    label: 'Sorting',
    icon: BarChart2,
    color: 'var(--purple)',
    base: '/sorting',
    children: [
      { label: 'Bubble Sort', path: '/sorting/bubble', key: 'sorting.bubble' },
      { label: 'Merge Sort',  path: '/sorting/merge',  key: 'sorting.merge'  },
      { label: 'Quick Sort',  path: '/sorting/quick',  key: 'sorting.quick'  },
      { label: 'Heap Sort',   path: '/sorting/heap',   key: 'sorting.heap'   },
      { label: 'Radix Sort',  path: '/sorting/radix',  key: 'sorting.radix'  },
    ],
  },
  {
    label: 'Trees',
    icon: GitBranch,
    color: 'var(--cyan)',
    base: '/trees',
    children: [
      { label: 'Binary Search Tree', path: '/trees/bst',  key: 'trees.bst'  },
      { label: 'AVL Tree',           path: '/trees/avl',  key: 'trees.avl'  },
      { label: 'Heap (Min/Max)',      path: '/trees/heap', key: 'trees.heap' },
    ],
  },
  {
    label: 'Graphs',
    icon: Share2,
    color: 'var(--pink)',
    base: '/graphs',
    children: [
      { label: 'BFS',           path: '/graphs/bfs',          key: 'graphs.bfs'         },
      { label: 'DFS',           path: '/graphs/dfs',          key: 'graphs.dfs'         },
      { label: 'Dijkstra',      path: '/graphs/dijkstra',     key: 'graphs.dijkstra'    },
      { label: 'Bellman-Ford',  path: '/graphs/bellman-ford', key: 'graphs.bellmanFord' },
    ],
  },
  {
    label: 'Linked Lists',
    icon: List,
    color: 'var(--lime)',
    base: '/linked-list',
    children: [
      { label: 'Singly Linked List', path: '/linked-list/singly', key: 'linkedList.singly' },
      { label: 'Doubly Linked List', path: '/linked-list/doubly', key: 'linkedList.doubly' },
    ],
  },
  {
    label: 'Stack & Queue',
    icon: Layers,
    color: 'var(--orange)',
    base: '/stack-queue',
    children: [
      { label: 'Stack', path: '/stack-queue/stack', key: 'stackQueue.stack' },
      { label: 'Queue', path: '/stack-queue/queue', key: 'stackQueue.queue' },
    ],
  },
  {
    label: 'Hash Map',
    icon: Hash,
    color: 'var(--yellow)',
    base: '/hashmap',
    children: [
      { label: 'Hash Map', path: '/hashmap', key: 'hashMap.hashMap' },
    ],
  },
  {
    label: 'Binary Search',
    icon: Search,
    color: 'var(--teal)',
    base: '/search',
    children: [
      { label: 'Binary Search', path: '/search', key: 'search.binary' },
    ],
  },
  {
    label: 'Dynamic Programming',
    icon: Brain,
    color: 'var(--rose)',
    base: '/dp',
    children: [
      { label: 'Fibonacci (Memo)', path: '/dp/fibonacci', key: 'dp.fibonacci' },
      { label: 'LCS',             path: '/dp/lcs',        key: 'dp.lcs'       },
      { label: '0/1 Knapsack',    path: '/dp/knapsack',   key: 'dp.knapsack'  },
    ],
  },
]

function SidebarSection({ item, progress }) {
  const location = useLocation()
  const isActive = location.pathname.startsWith(item.base)
  const [open, setOpen] = useState(isActive)
  const Icon = item.icon

  const doneCount = item.children.filter(c => {
    const [cat, alg] = c.key.split('.')
    return progress[cat]?.[alg]
  }).length

  return (
    <div className="sidebar-section">
      <button
        className={`sidebar-group-btn ${isActive ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        style={{ '--item-color': item.color }}
      >
        <Icon size={16} className="sidebar-group-icon" />
        <span className="sidebar-group-label">{item.label}</span>
        <span className="sidebar-group-count">{doneCount}/{item.children.length}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {open && (
        <div className="sidebar-children">
          {item.children.map(child => {
            const [cat, alg] = child.key.split('.')
            const done = progress[cat]?.[alg]
            return (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                {done
                  ? <CheckCircle2 size={13} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                  : <Circle size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
                }
                <span>{child.label}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { sidebarOpen, progress } = useApp()

  return (
    <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <span className="sidebar-header-label">Topics</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <SidebarSection key={item.base} item={item} progress={progress} />
          ))}
        </nav>
      </div>
    </aside>
  )
}
