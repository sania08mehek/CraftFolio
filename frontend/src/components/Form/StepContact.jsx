import React from 'react';

const StepContact = ({ userData, onChange }) => (
  <>
    <div className="field-grid full" style={{ marginBottom: '1rem' }}>
      <div className="field">
        <label>Contact Email *</label>
        <input
          type="email"
          value={userData.contact_email}
          onChange={e => onChange('contact_email', e.target.value)}
          placeholder="you@email.com"
        />
        <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: '.25rem' }}>
          Shown in the contact section of your portfolio.
        </span>
      </div>
    </div>
    <div className="field-grid" style={{ marginBottom: '1rem' }}>
      <div className="field">
        <label>GitHub URL</label>
        <input
          type="url"
          value={userData.github}
          onChange={e => onChange('github', e.target.value)}
          placeholder="https://github.com/yourname"
        />
      </div>
      <div className="field">
        <label>LinkedIn URL</label>
        <input
          type="url"
          value={userData.linkedin}
          onChange={e => onChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/yourname"
        />
      </div>
    </div>
    <div className="field-info-box">
      <span>💡</span>
      <span>These links appear in your navbar, hero section, and contact section automatically.</span>
    </div>
  </>
);

export default StepContact;
