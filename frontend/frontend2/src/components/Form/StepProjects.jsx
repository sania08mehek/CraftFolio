import React, { useState } from 'react';

const StepProjects = ({ projects, onUpdate }) => {
  const addProject = () => {
    onUpdate([...projects, { name: '', description: '', link: '', tech_stack: [] }]);
  };

  const removeProject = (index) => {
    const updated = [...projects];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const addTech = (pIndex, tech) => {
    const updated = [...projects];
    const techStack = updated[pIndex].tech_stack || [];
    if (tech && !techStack.includes(tech)) {
      updated[pIndex].tech_stack = [...techStack, tech];
      onUpdate(updated);
    }
  };

  const removeTech = (pIndex, techToRemove) => {
    const updated = [...projects];
    updated[pIndex].tech_stack = updated[pIndex].tech_stack.filter(t => t !== techToRemove);
    onUpdate(updated);
  };

  return (
    <>
      <div className="dynamic-list">
        {projects.map((p, i) => (
          <div key={i} className="dynamic-card">
            <button className="dynamic-card-remove" onClick={() => removeProject(i)}>×</button>
            <div className="field-grid" style={{ marginBottom: '.75rem' }}>
              <div className="field">
                <label>Project Name</label>
                <input 
                  type="text" 
                  value={p.name} 
                  onChange={(e) => updateProject(i, 'name', e.target.value)} 
                  placeholder="My Awesome App" 
                />
              </div>
              <div className="field">
                <label>Live Link</label>
                <input 
                  type="url" 
                  value={p.link} 
                  onChange={(e) => updateProject(i, 'link', e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            </div>
            <div className="field field-grid full" style={{ marginBottom: '.75rem' }}>
              <label>Description</label>
              <textarea 
                rows="2" 
                value={p.description} 
                onChange={(e) => updateProject(i, 'description', e.target.value)} 
                placeholder="What does it do? What problem does it solve?"
              ></textarea>
            </div>
            <div className="field field-grid full">
              <label>Tech Stack <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--muted)' }}>(Enter to add)</span></label>
              <div className="tags-wrap" onClick={(e) => e.currentTarget.querySelector('input').focus()}>
                {(p.tech_stack || []).map(t => (
                  <span key={t} className="tag">
                    {t}
                    <span className="tag-x" onClick={() => removeTech(i, t)}>×</span>
                  </span>
                ))}
                <input 
                  type="text" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTech(i, e.target.value.trim().replace(/,/g, ''));
                      e.target.value = '';
                    }
                  }} 
                  placeholder="React, TypeScript..." 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="add-item-btn" onClick={addProject}>+ Add Project</button>
    </>
  );
};

export default StepProjects;
