import React, { useState } from 'react';

const StepSkills = ({ skills, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim().replace(/,/g, '');
      if (val && !skills.includes(val)) {
        onUpdate([...skills, val]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && skills.length) {
      onUpdate(skills.slice(0, -1));
    }
  };

  const removeSkill = (skillToRemove) => {
    onUpdate(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="field field-grid full">
      <label>Skills <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--muted)' }}>(type and press Enter)</span></label>
      <div className="tags-wrap" onClick={() => document.getElementById('skill-input').focus()}>
        {skills.map(s => (
          <span key={s} className="tag">
            {s}
            <span className="tag-x" onClick={() => removeSkill(s)}>×</span>
          </span>
        ))}
        <input 
          type="text" 
          id="skill-input" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length ? 'Add more...' : 'React, Node.js, Python...'}
        />
      </div>
    </div>
  );
};

export default StepSkills;
