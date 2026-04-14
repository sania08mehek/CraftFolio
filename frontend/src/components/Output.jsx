import React from 'react';

const Output = ({ generatedHtml, onBack, onStartOver, showToast }) => {
  const hasHtml = !!generatedHtml;

  const copyCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml)
      .then(() => showToast('HTML copied to clipboard! 🎉'))
      .catch(() => showToast('Could not access clipboard', 'warn'));
  };

  const downloadHtml = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download started! ↓');
  };

  return (
    <div className="output-page">
      {/* Action bar */}
      <div className="output-bar">
        <div className="output-bar-left">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Edit Details</button>
          <div className="output-file-info">
            <span className="output-filename">portfolio.html</span>
            {hasHtml && (
              <span className="success-badge">✓ {Math.round(generatedHtml.length / 1024)} KB · Ready</span>
            )}
          </div>
        </div>
        <div className="output-bar-right">
          <button className="btn btn-ghost btn-sm" onClick={copyCode} disabled={!hasHtml}>
            ⎘ Copy HTML
          </button>
          <button className="btn btn-primary btn-sm" onClick={downloadHtml} disabled={!hasHtml}>
            ↓ Download HTML
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onStartOver}>
            ↺ Start Over
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="output-preview-area">
        {hasHtml ? (
          <iframe
            id="portfolio-preview"
            srcDoc={generatedHtml}
            sandbox="allow-scripts allow-same-origin"
            title="Your Portfolio Preview"
            className="output-iframe"
          />
        ) : (
          <div className="output-error">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3>Generation failed</h3>
            <p>The backend couldn't generate your portfolio. Make sure the backend server is running and try again.</p>
            <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: '1.5rem' }}>
              ← Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
