import './CodePanel.css'

const LANG_LABELS = { python: 'Python', java: 'Java', cpp: 'C++' }

export default function CodePanel({ code, language, onLanguageChange, currentLine }) {
  const lines = code?.[language] || []

  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <span className="code-panel-title">Code</span>
        <div className="code-lang-tabs">
          {Object.keys(LANG_LABELS).map(lang => (
            <button
              key={lang}
              className={`code-lang-btn ${language === lang ? 'active' : ''}`}
              onClick={() => onLanguageChange(lang)}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="code-body">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`code-line ${i === currentLine ? 'code-line-active' : ''}`}
          >
            <span className="code-line-num">{i + 1}</span>
            <span className="code-line-text">{line || '\u00a0'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
