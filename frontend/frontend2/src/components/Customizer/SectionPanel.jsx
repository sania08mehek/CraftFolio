import React from 'react';

const SectionPanel = ({ sections_order, excluded_sections, section_layouts, onUpdateOrder, onToggleExclude, onSetLayout }) => {
  
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('index'));
    if (sourceIndex === targetIndex) return;

    const newOrder = [...sections_order];
    const [removed] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    onUpdateOrder(newOrder);
  };

  return (
    <div className="panel">
      <div className="panel-title"><div className="icon">≡</div> Sections</div>
      <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.85rem' }}>
        Drag to reorder · Toggle visibility · Pick layout (1–3)
      </div>
      
      {/* Navbar is always there */}
      <div style={{ marginBottom: '.5rem', padding: '.5rem .85rem', background: 'rgba(52,211,153,.06)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '.75rem', border: '1px solid rgba(52,211,153,.15)' }}>
        <span style={{ fontSize: '.8rem', fontWeight: 700, flexShrink: 0 }}>⊞</span>
        <span className="section-name">navbar</span>
        <span className="section-badge always">always</span>
        <div className="layout-btns">
          {[1, 2, 3].map(n => (
            <button 
              key={n}
              className={`layout-btn ${section_layouts.navbar === n ? 'active' : ''}`} 
              onClick={() => onSetLayout('navbar', n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="section-list">
        {sections_order.map((s, i) => {
          const excluded = excluded_sections.includes(s);
          return (
            <div 
              key={s}
              className={`section-item ${excluded ? 'excluded' : ''}`} 
              draggable="true"
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, i)}
            >
              <span className="drag-handle">⠿</span>
              <span className="section-name">{s}</span>
              <span className="section-badge">optional</span>
              <div className="layout-btns">
                {[1, 2, 3].map(n => (
                  <button 
                    key={n}
                    className={`layout-btn ${section_layouts[s] === n ? 'active' : ''}`} 
                    onClick={() => onSetLayout(s, n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button 
                className={`exclude-btn ${excluded ? 'excluded' : ''}`} 
                onClick={() => onToggleExclude(s)}
                title={excluded ? 'Include' : 'Exclude'}
              >
                {excluded ? '+' : '×'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionPanel;
