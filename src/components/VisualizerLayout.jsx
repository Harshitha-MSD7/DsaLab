import { useState } from 'react'
import { CheckCircle2, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import CodePanel from './CodePanel'
import ComplexityPanel from './ComplexityPanel'
import './VisualizerLayout.css'

export default function VisualizerLayout({
  title, subtitle, category, algoKey,
  controls, visualization,
  code, language, onLanguageChange, currentLine, stepDesc,
  complexity, quizNode,
  explanation,
}) {
  const { markComplete, progress } = useApp()
  const isDone = progress[category]?.[algoKey]
  const [activeTab, setActiveTab] = useState('code')

  return (
    <div className="viz-layout">
      {/* Header */}
      <div className="viz-header">
        <div className="viz-header-left">
          <h1 className="viz-title">{title}</h1>
          {subtitle && <p className="viz-subtitle">{subtitle}</p>}
        </div>
        <div className="viz-header-right">
          {!isDone && (
            <button
              className="btn btn-secondary"
              onClick={() => markComplete(category, algoKey)}
            >
              <CheckCircle2 size={15} />
              Mark Complete
            </button>
          )}
          {isDone && (
            <div className="viz-done-badge">
              <CheckCircle2 size={15} />
              Completed!
            </div>
          )}
        </div>
      </div>

      {/* Step description bar */}
      {stepDesc && (
        <div className="viz-step-desc">
          <Info size={14} />
          <span>{stepDesc}</span>
        </div>
      )}

      {/* Controls */}
      {controls && <div className="viz-controls">{controls}</div>}

      {/* Main area: visualization + side panel */}
      <div className="viz-body">
        <div className="viz-canvas">{visualization}</div>

        <div className="viz-side">
          {/* Tabs */}
          <div className="viz-tabs">
            <button className={`viz-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>Code</button>
            <button className={`viz-tab ${activeTab === 'complexity' ? 'active' : ''}`} onClick={() => setActiveTab('complexity')}>Complexity</button>
            {explanation && <button className={`viz-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Info</button>}
          </div>

          {activeTab === 'code' && code && (
            <CodePanel
              code={code}
              language={language}
              onLanguageChange={onLanguageChange}
              currentLine={currentLine}
            />
          )}
          {activeTab === 'complexity' && complexity && (
            <ComplexityPanel data={complexity} />
          )}
          {activeTab === 'info' && explanation && (
            <div className="viz-info-panel">
              {explanation}
            </div>
          )}
        </div>
      </div>

      {quizNode}
    </div>
  )
}
