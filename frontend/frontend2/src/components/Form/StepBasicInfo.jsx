import React from 'react';

const StepBasicInfo = ({ userData, onChange }) => {
  return (
    <>
      <div className="field-grid">
        <div className="field">
          <label>Full Name *</label>
          <input 
            type="text" 
            value={userData.name} 
            onChange={(e) => onChange('name', e.target.value)} 
            placeholder="Alex Johnson"
          />
        </div>
        <div className="field">
          <label>Professional Title *</label>
          <input 
            type="text" 
            value={userData.title} 
            onChange={(e) => onChange('title', e.target.value)} 
            placeholder="Full-Stack Engineer"
          />
        </div>
      </div>
      <div className="field field-grid full">
        <label>Bio / About *</label>
        <textarea 
          rows="4" 
          value={userData.bio} 
          onChange={(e) => onChange('bio', e.target.value)} 
          placeholder="A brief paragraph about who you are, your background, and what drives you..."
        ></textarea>
      </div>
    </>
  );
};

export default StepBasicInfo;
