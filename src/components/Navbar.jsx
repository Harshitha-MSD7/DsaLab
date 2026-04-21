import { Link } from 'react-router-dom'
import { Sun, Moon, Menu, X, ExternalLink, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen, getTotalProgress } = useApp()
  const { done, total, pct } = getTotalProgress()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="navbar-title">AlgoViz</span>
        </Link>
      </div>

      <div className="navbar-center hide-mobile">
        <div className="navbar-progress">
          <span className="navbar-progress-text">
            {done}/{total} completed
          </span>
          <div className="navbar-progress-bar">
            <div className="navbar-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="navbar-progress-pct">{pct}%</span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="btn btn-ghost btn-icon tooltip-container"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="tooltip">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost btn-icon tooltip-container hide-mobile"
        >
          <ExternalLink size={18} />
          <span className="tooltip">GitHub</span>
        </a>
      </div>
    </nav>
  )
}
