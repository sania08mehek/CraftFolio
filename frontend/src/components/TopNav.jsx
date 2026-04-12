import React from 'react';

const TopNav = ({ step, onBack }) => {
  const steps = ['Customize', 'Details', 'Build', 'Output'];
  return (
    <nav className="top-nav">
      <span className="logo">CraftFolio</span>
      <div className="step-trail">
        {steps.map((_, i) => (
          <div key={i} className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}></div>
        ))}
      </div>
      {step > 0 ? (
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Back
        </button>
      ) : (
        <span></span>
      )}
    </nav>
  );
};

export default TopNav;
