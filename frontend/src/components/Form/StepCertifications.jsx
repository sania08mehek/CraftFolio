import React, { useState } from 'react';

const EMPTY_CERT = { name: '', issuer: '', year: '', link: '' };

const StepCertifications = ({ certifications, onUpdate }) => {
  const add    = () => onUpdate([...certifications, { ...EMPTY_CERT }]);
  const remove = (i) => { const c = [...certifications]; c.splice(i, 1); onUpdate(c); };
  const update = (i, field, val) => {
    const c = [...certifications];
    c[i] = { ...c[i], [field]: val };
    onUpdate(c);
  };

  return (
    <>
      <div className="dynamic-list">
        {certifications.map((c, i) => (
          <div key={i} className="dynamic-card">
            <button className="dynamic-card-remove" onClick={() => remove(i)} title="Remove">×</button>
            <div className="field-grid" style={{ marginBottom: '.75rem' }}>
              <div className="field">
                <label>Certification Name *</label>
                <input type="text" value={c.name} onChange={e => update(i, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
              </div>
              <div className="field">
                <label>Issuing Organization *</label>
                <input type="text" value={c.issuer} onChange={e => update(i, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Year Obtained</label>
                <input type="text" value={c.year} onChange={e => update(i, 'year', e.target.value)} placeholder="2024" maxLength={4} />
              </div>
              <div className="field">
                <label>Verify / Badge Link</label>
                <input type="url" value={c.link} onChange={e => update(i, 'link', e.target.value)} placeholder="https://verify.link/..." />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="add-item-btn" onClick={add}>+ Add Certification</button>
    </>
  );
};

export default StepCertifications;
