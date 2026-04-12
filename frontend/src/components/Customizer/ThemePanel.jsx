import React from 'react';
import { THEMES } from '../../constants';
import ThemePreview from './ThemePreview';

const ThemePanel = ({ theme, themeTab, onThemeChange, onTabChange }) => {
  const themes = THEMES[themeTab];

  return (
    <div className="panel">
      <div className="panel-title"><div className="icon">◐</div> Theme</div>
      <div className="theme-tabs">
        <button 
          className={`tab-btn ${themeTab === 'light' ? 'active' : ''}`} 
          onClick={() => onTabChange('light')}
        >
          Light
        </button>
        <button 
          className={`tab-btn ${themeTab === 'dark' ? 'active' : ''}`} 
          onClick={() => onTabChange('dark')}
        >
          Dark
        </button>
      </div>
      <div className="themes-grid">
        {Object.entries(themes).map(([name, vals]) => (
          <div 
            key={name}
            className={`theme-swatch ${theme === name ? 'selected' : ''}`} 
            onClick={() => onThemeChange(name)}
          >
            <div className="swatch-circle" style={{ background: vals.bg, border: `2px solid ${vals.accent}` }}></div>
            <div className="swatch-label">{name}</div>
          </div>
        ))}
      </div>
      <div className="divider"></div>
      <div className="panel-title" style={{ marginBottom: '.75rem' }}><div className="icon">⊞</div> Preview</div>
      <div id="theme-preview" style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', height: '120px', display: 'flex', flexDirection: 'column' }}>
        <ThemePreview theme={theme} />
      </div>
    </div>
  );
};

export default ThemePanel;
