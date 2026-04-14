import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ALL_SECTIONS, OPTIONAL_SECTIONS, REQUIRED_SECTIONS,
  SECTION_LABELS, SECTION_ICONS, LAYOUT_COUNT, SAMPLE_USER,
} from '../../constants';

const API = 'http://localhost:8000';

// ── Section row ────────────────────────────────────────────────────────────

const SectionRow = ({ section, layoutNum, excluded, confirmed, focused, onSetLayout, onToggleExclude, onFocus }) => {
  const isRequired = REQUIRED_SECTIONS.includes(section);
  const isOptional = OPTIONAL_SECTIONS.includes(section);

  return (
    <div className={`lp-section-row ${focused ? 'focused' : ''} ${excluded ? 'excluded' : ''}`} onClick={() => !excluded && onFocus(section)}>
      <div className="lp-row-left">
        <span className="lp-row-icon">{SECTION_ICONS[section]}</span>
        <div>
          <div className="lp-row-name">{SECTION_LABELS[section]}</div>
          {isRequired && <div className="lp-row-badge required">required</div>}
          {isOptional && !excluded && <div className="lp-row-badge optional">optional</div>}
          {excluded && <div className="lp-row-badge excluded-badge">hidden</div>}
        </div>
      </div>

      <div className="lp-row-right">
        {/* Layout buttons (only when not excluded) */}
        {!excluded && (
          <div className="lp-layout-btns">
            {Array.from({ length: LAYOUT_COUNT }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`lp-layout-btn ${layoutNum === n ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onSetLayout(section, n); onFocus(section); }}
                title={`Layout ${n}`}
              >
                L{n}
              </button>
            ))}
          </div>
        )}

        {/* Toggle visibility for optional sections */}
        {isOptional && (
          <button
            className={`lp-toggle-btn ${excluded ? 'off' : 'on'}`}
            onClick={(e) => { e.stopPropagation(); onToggleExclude(section); }}
            title={excluded ? 'Include section' : 'Hide section'}
          >
            {excluded ? '+ Include' : '× Hide'}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Drag-to-reorder list (for non-navbar sections) ─────────────────────────

const DRAGGABLE_SECTIONS = ALL_SECTIONS.filter(s => s !== 'navbar');

const ReorderList = ({ sections_order, excluded_sections, section_layouts, focusedSection, onUpdateOrder, onToggleExclude, onSetLayout, onFocus }) => {
  const dragIdx = useRef(null);

  const handleDragStart = (e, idx) => { dragIdx.current = idx; e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver  = (e) => e.preventDefault();
  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    const src = dragIdx.current;
    if (src === null || src === targetIdx) return;
    const newOrder = [...sections_order];
    const [moved] = newOrder.splice(src, 1);
    newOrder.splice(targetIdx, 0, moved);
    onUpdateOrder(newOrder);
    dragIdx.current = null;
  };

  return (
    <div className="lp-section-list">
      {sections_order.map((s, i) => (
        <div
          key={s}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, i)}
          className="lp-draggable"
        >
          <span className="lp-drag-handle" title="Drag to reorder">⠿</span>
          <SectionRow
            section={s}
            layoutNum={section_layouts[s] || 1}
            excluded={excluded_sections.includes(s)}
            focused={focusedSection === s}
            onSetLayout={onSetLayout}
            onToggleExclude={onToggleExclude}
            onFocus={onFocus}
          />
        </div>
      ))}
    </div>
  );
};

// ── Preview iframe ─────────────────────────────────────────────────────────

const PreviewPane = ({ section, layoutNum, theme }) => {
  const [html, setHtml]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(false);
  const abortRef = useRef(null);

  const fetchPreview = useCallback(async () => {
    if (!section) return;
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`${API}/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({ section, layout: layoutNum, theme, user_data: SAMPLE_USER }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setHtml(data.html);
    } catch (err) {
      if (err.name !== 'AbortError') setError(true);
    } finally {
      setLoading(false);
    }
  }, [section, layoutNum, theme]);

  useEffect(() => { fetchPreview(); }, [fetchPreview]);

  if (!section) {
    return (
      <div className="lp-preview-empty">
        <div className="lp-preview-empty-icon">👆</div>
        <div>Click any section on the left to preview its layout</div>
      </div>
    );
  }

  return (
    <div className="lp-preview-wrap">
      <div className="lp-preview-label">
        <span>{SECTION_ICONS[section]} {SECTION_LABELS[section]} — Layout {layoutNum}</span>
        <span className="lp-preview-theme-badge">{theme}</span>
      </div>
      <div className="lp-preview-frame-wrap">
        {loading && (
          <div className="lp-preview-loading">
            <div className="lp-spinner" />
            <span>Rendering preview…</span>
          </div>
        )}
        {error && (
          <div className="lp-preview-error">
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Backend offline</div>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
              Start the backend to see live previews:<br />
              <code style={{ fontSize: '.8rem' }}>uvicorn main:app --reload --port 8000</code>
            </div>
          </div>
        )}
        {!loading && !error && html && (
          <iframe
            srcDoc={html}
            title={`${section} layout ${layoutNum} preview`}
            sandbox="allow-scripts allow-same-origin"
            className="lp-preview-iframe"
          />
        )}
      </div>
    </div>
  );
};

// ── Main LayoutPicker ──────────────────────────────────────────────────────

const LayoutPicker = ({ customization, onUpdate, onNext, onBack }) => {
  const [focusedSection, setFocusedSection] = useState('navbar');

  const { theme, sections_order, excluded_sections, section_layouts } = customization;

  const updateCustomization = (updates) => onUpdate({ ...customization, ...updates });

  const handleSetLayout = (section, n) => {
    updateCustomization({ section_layouts: { ...section_layouts, [section]: n } });
    setFocusedSection(section);
  };

  const handleToggleExclude = (section) => {
    const excl = [...excluded_sections];
    const idx  = excl.indexOf(section);
    if (idx >= 0) excl.splice(idx, 1); else excl.push(section);
    updateCustomization({ excluded_sections: excl });
    if (excl.includes(section) && focusedSection === section) setFocusedSection(null);
  };

  const handleUpdateOrder = (newOrder) => {
    updateCustomization({ sections_order: newOrder });
  };

  const activeLayout = section_layouts[focusedSection] || 1;

  return (
    <div className="lp-page">
      {/* Top bar */}
      <div className="lp-topbar">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Theme</button>
        <div className="lp-topbar-center">
          <div className="lp-step-label">Step 2 of 3</div>
          <h2 className="lp-heading">Choose Section Layouts</h2>
        </div>
        <button className="btn btn-primary" onClick={onNext}>
          Next: Your Details →
        </button>
      </div>

      <div className="lp-body">
        {/* Left: section list */}
        <div className="lp-left">
          <div className="lp-left-hint">Click a section to preview · Drag ⠿ to reorder · Hide optional sections</div>

          {/* Navbar row (non-draggable, required) */}
          <div className="lp-navbar-row">
            <SectionRow
              section="navbar"
              layoutNum={section_layouts.navbar || 1}
              excluded={false}
              focused={focusedSection === 'navbar'}
              onSetLayout={handleSetLayout}
              onToggleExclude={() => {}}
              onFocus={setFocusedSection}
            />
          </div>

          <div className="lp-left-divider" />

          {/* Reorderable sections */}
          <ReorderList
            sections_order={sections_order}
            excluded_sections={excluded_sections}
            section_layouts={section_layouts}
            focusedSection={focusedSection}
            onUpdateOrder={handleUpdateOrder}
            onToggleExclude={handleToggleExclude}
            onSetLayout={handleSetLayout}
            onFocus={setFocusedSection}
          />
        </div>

        {/* Right: live preview iframe */}
        <div className="lp-right">
          <PreviewPane
            section={focusedSection}
            layoutNum={activeLayout}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutPicker;
