import React from 'react';
import { THEMES } from '../../constants';

const ThemePreview = ({ theme }) => {
  const allThemes = { ...THEMES.light, ...THEMES.dark };
  const vals = allThemes[theme] || { bg: '#0D1117', accent: '#58A6FF' };
  const isDark = Object.keys(THEMES.dark).includes(theme);
  
  const tc = isDark ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.85)';
  const sc = isDark ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)';

  return (
    <div style={{ flex: 1, background: vals.bg, padding: '.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
      <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: vals.accent, opacity: .9 }}></div>
      <div style={{ width: '90px', height: '10px', borderRadius: '3px', background: tc, opacity: .7, marginTop: '.2rem' }}></div>
      <div style={{ width: '60px', height: '8px', borderRadius: '3px', background: sc, opacity: .5 }}></div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: '.4rem' }}>
        <div style={{ padding: '.25rem .6rem', background: vals.accent, borderRadius: '4px', fontSize: '.65rem', color: '#fff', fontWeight: 600 }}>
          {theme}
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
