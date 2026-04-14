import React from 'react';

const StepBasicInfo = ({ userData, onChange }) => (
  <>
    <div className="field-grid full" style={{ marginBottom: '1rem' }}>
      <div className="field">
        <label>Full Name *</label>
        <input
          type="text"
          value={userData.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="e.g. Alex Rivera"
        />
      </div>
    </div>
    <div className="field-grid full" style={{ marginBottom: '1rem' }}>
      <div className="field">
        <label>Professional Title *</label>
        <input
          type="text"
          value={userData.title}
          onChange={e => onChange('title', e.target.value)}
          placeholder="e.g. Full Stack Developer & Open Source Contributor"
        />
      </div>
    </div>
    <div className="field-grid full">
      <div className="field">
        <label>Bio / About *</label>
        <textarea
          rows={5}
          value={userData.bio}
          onChange={e => onChange('bio', e.target.value)}
          placeholder="Write 2–4 sentences about yourself — your experience, what you build, and what drives you."
        />
        <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.25rem' }}>
          {userData.bio.length} / 500 chars recommended
        </span>
      </div>
    </div>
  </>
);

export default StepBasicInfo;
