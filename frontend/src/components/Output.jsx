import React from 'react';
import TopNav from './TopNav';
import { THEMES } from '../constants';

const Output = ({ generatedHtml, customization, onBack, onStartOver, showToast }) => {
  const hasHtml = !!generatedHtml;

  const copyCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    showToast('Code copied to clipboard!');
  };

  const downloadHtml = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download started!');
  };

  const renderDemoPreview = () => {
    const t = customization.theme;
    const allT = { ...THEMES.light, ...THEMES.dark };
    const vals = allT[t] || { bg: '#0D1117', accent: '#58A6FF' };
    const isDark = Object.keys(THEMES.dark).includes(t);
    const tc = isDark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.85)';
    const sc = isDark ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.5)';
    const bc = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';

    return (
      <div style={{ flex: 1, background: vals.bg, padding: '3rem', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.75rem 1.5rem', background: bc, borderRadius: '8px' }}>
          <span style={{ color: vals.accent, fontWeight: 700 }}>Portfolio</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {customization.sections_order.filter(s => !customization.excluded_sections.includes(s)).map(s => (
              <span key={s} style={{ fontSize: '.75rem', color: sc }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: '640px', margin: '2rem auto', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: vals.accent, opacity: .2, margin: '0 auto 1.5rem' }}></div>
          <div style={{ width: '280px', height: '20px', borderRadius: '4px', background: tc, opacity: .8, margin: '0 auto .75rem' }}></div>
          <div style={{ width: '180px', height: '14px', borderRadius: '4px', background: sc, opacity: .6, margin: '0 auto .5rem' }}></div>
          <div style={{ width: '360px', height: '10px', borderRadius: '4px', background: bc, margin: '.5rem auto' }}></div>
          <div style={{ width: '300px', height: '10px', borderRadius: '4px', background: bc, margin: '.5rem auto' }}></div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
            <div style={{ padding: '.5rem 1.25rem', background: vals.accent, borderRadius: '6px', fontSize: '.75rem', color: '#fff' }}>Get In Touch</div>
            <div style={{ padding: '.5rem 1.25rem', border: `1px solid ${vals.accent}`, borderRadius: '6px', fontSize: '.75rem', color: vals.accent }}>GitHub ↗</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: sc, fontSize: '.8rem', padding: '1rem', borderTop: `1px solid ${bc}`, marginTop: 'auto' }}>
          ✦ Preview reflects your selected theme: <strong style={{ color: vals.accent }}>{t}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="output-page">
      <TopNav step={3} onBack={onBack} />
      <div className="output-toolbar">
        <div className="output-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <strong>portfolio.html</strong>
            <span className="success-badge">✓ Ready</span>
          </div>
          <span>{hasHtml ? Math.round(generatedHtml.length / 1024) + 'KB · Single file · No dependencies' : 'Demo preview mode'}</span>
        </div>
        <div className="output-actions">
          <button className="btn btn-ghost btn-sm" onClick={copyCode}>⎘ Copy Code</button>
          <button className="btn btn-primary btn-sm" onClick={downloadHtml}>↓ Download HTML</button>
          <button className="btn btn-ghost btn-sm" onClick={onStartOver}>↺ Start Over</button>
        </div>
      </div>
      <div className="output-preview">
        {hasHtml ? (
          <iframe 
            id="preview-iframe" 
            srcDoc={generatedHtml} 
            sandbox="allow-scripts allow-same-origin" 
            title="Portfolio Preview"
            style={{ flex: 1, border: 'none', width: '100%', minHeight: '500px' }}
          ></iframe>
        ) : renderDemoPreview()}
      </div>
    </div>
  );
};

export default Output;
