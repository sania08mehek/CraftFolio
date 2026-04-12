import React from 'react';

const StepLinks = ({ userData, onChange }) => {
  return (
    <>
      <div className="field-grid">
        <div className="field">
          <label>GitHub URL</label>
          <input 
            type="url" 
            value={userData.github} 
            onChange={(e) => onChange('github', e.target.value)} 
            placeholder="https://github.com/you"
          />
        </div>
        <div className="field">
          <label>LinkedIn URL</label>
          <input 
            type="url" 
            value={userData.linkedin} 
            onChange={(e) => onChange('linkedin', e.target.value)} 
            placeholder="https://linkedin.com/in/you"
          />
        </div>
      </div>
      <div className="field-grid">
        <div className="field">
          <label>Contact Email</label>
          <input 
            type="email" 
            value={userData.contact_email} 
            onChange={(e) => onChange('contact_email', e.target.value)} 
            placeholder="hello@you.dev"
          />
        </div>
        <div className="field">
          <label>Profile Image URL</label>
          <input 
            type="url" 
            value={userData.profile_image} 
            onChange={(e) => onChange('profile_image', e.target.value)} 
            placeholder="https://... or leave blank"
          />
        </div>
      </div>
    </>
  );
};

export default StepLinks;
