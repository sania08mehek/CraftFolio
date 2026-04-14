import React from 'react';
import { THEMES } from '../../constants';

const ThemePicker = ({ theme, onThemeChange, onNext, onBack }) => {
  const [tab, setTab] = React.useState(
    Object.keys(THEMES.dark).includes(theme) ? 'dark' : 'light'
  );

  const currentGroup = THEMES[tab];

  return (
    <div className="theme-picker-page">
      {/* Header */}
      <div className="tp-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        <div className="tp-title-wrap">
          <div className="tp-step-label">Step 1 of 3</div>
          <h2 className="tp-heading">Choose Your Theme</h2>
          <p className="tp-sub">Pick the colour palette that best represents your style.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!theme}
        >
          Next: Layouts →
        </button>
      </div>

      {/* Tabs */}
      <div className="tp-tabs">
        <button
          className={`tp-tab ${tab === 'dark' ? 'active' : ''}`}
          onClick={() => setTab('dark')}
        >
          🌙 Dark Themes
        </button>
        <button
          className={`tp-tab ${tab === 'light' ? 'active' : ''}`}
          onClick={() => setTab('light')}
        >
          ☀️ Light Themes
        </button>
      </div>

      {/* Theme cards */}
      <div className="tp-grid">
        {Object.entries(currentGroup).map(([name, vals]) => {
          const selected = theme === name;
          return (
            <button
              key={name}
              className={`tp-card ${selected ? 'selected' : ''}`}
              onClick={() => onThemeChange(name)}
            >
              {/* Color preview bar */}
              <div className="tp-card-preview" style={{ background: vals.bg }}>
                <div className="tp-preview-nav" style={{ background: `${vals.bg}cc`, borderBottom: `1px solid ${vals.accent}22` }}>
                  <div className="tp-preview-logo" style={{ background: vals.accent, opacity: 0.9 }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ width: 24, height: 6, borderRadius: 3, background: vals.accent, opacity: 0.25 }} />
                    ))}
                  </div>
                </div>
                <div className="tp-preview-body">
                  <div style={{ width: '55%', height: 12, borderRadius: 4, background: vals.accent, opacity: 0.85, marginBottom: 8 }} />
                  <div style={{ width: '80%', height: 8, borderRadius: 4, background: vals.accent, opacity: 0.3, marginBottom: 6 }} />
                  <div style={{ width: '65%', height: 8, borderRadius: 4, background: vals.accent, opacity: 0.2, marginBottom: 16 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ padding: '5px 14px', borderRadius: 6, background: vals.accent, opacity: 0.9, fontSize: 11, color: tab === 'dark' ? '#fff' : '#000', fontWeight: 700 }}>Hire Me</div>
                    <div style={{ padding: '5px 14px', borderRadius: 6, border: `1px solid ${vals.accent}`, opacity: 0.6, fontSize: 11 }} />
                  </div>
                </div>
                <div className="tp-preview-chips">
                  {['React', 'Node', 'AWS'].map(t => (
                    <span key={t} style={{ padding: '3px 10px', borderRadius: 20, background: vals.accent2, opacity: 0.18, fontSize: 10, border: `1px solid ${vals.accent2}44` }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="tp-card-meta">
                <div className="tp-card-name-row">
                  <span className="tp-card-name">{name}</span>
                  {selected && <span className="tp-check">✓</span>}
                </div>
                <div className="tp-card-desc">{vals.desc}</div>
                <div className="tp-card-swatches">
                  <span className="tp-swatch" style={{ background: vals.bg, border: '1px solid rgba(255,255,255,.15)' }} title="Background" />
                  <span className="tp-swatch" style={{ background: vals.accent }} title="Accent" />
                  <span className="tp-swatch" style={{ background: vals.accent2 }} title="Secondary" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePicker;
