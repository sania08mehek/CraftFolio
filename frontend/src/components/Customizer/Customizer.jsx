import React, { useState } from 'react';
import TopNav from '../TopNav';
import ThemePanel from './ThemePanel';
import SectionPanel from './SectionPanel';

const Customizer = ({ customization, onUpdate, onNext, onBack }) => {
  const [themeTab, setThemeTab] = useState('dark');

  const updateCustomization = (updates) => {
    onUpdate({ ...customization, ...updates });
  };

  return (
    <div>
      <TopNav step={0} onBack={onBack} />
      <div className="customize-layout">
        <ThemePanel 
          theme={customization.theme} 
          themeTab={themeTab}
          onThemeChange={(theme) => updateCustomization({ theme })}
          onTabChange={setThemeTab}
        />
        <SectionPanel 
          sections_order={customization.sections_order}
          excluded_sections={customization.excluded_sections}
          section_layouts={customization.section_layouts}
          onUpdateOrder={(order) => updateCustomization({ sections_order: order })}
          onToggleExclude={(s) => {
            const excl = [...customization.excluded_sections];
            const idx = excl.indexOf(s);
            if (idx >= 0) excl.splice(idx, 1); else excl.push(s);
            updateCustomization({ excluded_sections: excl });
          }}
          onSetLayout={(s, n) => {
            const layouts = { ...customization.section_layouts, [s]: n };
            updateCustomization({ section_layouts: layouts });
          }}
        />
      </div>
      <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={onNext}>Next: Your Details →</button>
      </div>
    </div>
  );
};

export default Customizer;
