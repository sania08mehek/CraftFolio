import React from 'react';

const StepCertifications = ({ certifications, onUpdate }) => {
  const addCert = () => {
    onUpdate([...certifications, { name: '', issuer: '', year: '', link: '' }]);
  };

  const removeCert = (index) => {
    const updated = [...certifications];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  const updateCert = (index, field, value) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  return (
    <>
      <div className="dynamic-list">
        {certifications.map((c, i) => (
          <div key={i} className="dynamic-card">
            <button className="dynamic-card-remove" onClick={() => removeCert(i)}>×</button>
            <div className="field-grid">
              <div className="field">
                <label>Certification Name</label>
                <input 
                  type="text" 
                  value={c.name} 
                  onChange={(e) => updateCert(i, 'name', e.target.value)} 
                  placeholder="AWS Solutions Architect" 
                />
              </div>
              <div className="field">
                <label>Issuing Body</label>
                <input 
                  type="text" 
                  value={c.issuer} 
                  onChange={(e) => updateCert(i, 'issuer', e.target.value)} 
                  placeholder="Amazon Web Services" 
                />
              </div>
            </div>
            <div className="field-grid" style={{ marginTop: '.75rem' }}>
              <div className="field">
                <label>Year</label>
                <input 
                  type="number" 
                  value={c.year} 
                  onChange={(e) => updateCert(i, 'year', e.target.value)} 
                  placeholder="2024" 
                  min="2000" 
                  max="2030" 
                />
              </div>
              <div className="field">
                <label>Credential URL</label>
                <input 
                  type="url" 
                  value={c.link} 
                  onChange={(e) => updateCert(i, 'link', e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="add-item-btn" onClick={addCert}>+ Add Certification</button>
    </>
  );
};

export default StepCertifications;
