import React, { useState } from 'react';

const StepSkills = ({ skills, onUpdate }) => {
  const [input, setInput] = useState('');

  const addSkill = (raw) => {
    const skill = raw.trim().replace(/,$/, '');
    if (skill && !skills.includes(skill)) {
      onUpdate([...skills, skill]);
    }
    setInput('');
  };

  const removeSkill = (s) => onUpdate(skills.filter(x => x !== s));

  return (
    <>
      <div className="field" style={{ marginBottom: '1.25rem' }}>
        <label>
          Skills{' '}
          <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--muted)' }}>
            (type &amp; press Enter or comma to add)
          </span>
        </label>
        <div className="tags-wrap" onClick={e => e.currentTarget.querySelector('input').focus()}>
          {skills.map(s => (
            <span key={s} className="tag">
              {s}
              <span className="tag-x" onClick={() => removeSkill(s)}>×</span>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addSkill(e.target.value);
              } else if (e.key === 'Backspace' && !input && skills.length) {
                removeSkill(skills[skills.length - 1]);
              }
            }}
            onBlur={() => input.trim() && addSkill(input)}
            placeholder={skills.length ? '' : 'React, TypeScript, Node.js…'}
          />
        </div>
        <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.35rem' }}>
          {skills.length} skill{skills.length !== 1 ? 's' : ''} added
        </div>
      </div>

      {skills.length > 0 && (
        <div className="skill-preview-wrap">
          <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>Preview</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
            {skills.map(s => (
              <span key={s} className="skill-preview-chip">{s}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StepSkills;
