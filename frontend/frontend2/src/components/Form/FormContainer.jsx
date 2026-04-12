import React, { useState, useRef } from 'react';
import TopNav from '../TopNav';
import StepBasicInfo from './StepBasicInfo';
import StepLinks from './StepLinks';
import StepSkills from './StepSkills';
import StepProjects from './StepProjects';
import StepCertifications from './StepCertifications';
import { FORM_STEPS } from '../../constants';

const FormContainer = ({ userData, onUpdate, onBack, onGenerate, showToast }) => {
  const [formStep, setFormStep] = useState(0);

  const updateUserData = (field, value) => {
    onUpdate({ ...userData, [field]: value });
  };

  const handleNext = () => {
    if (formStep === 0) {
      if (!userData.name || !userData.title || !userData.bio) {
        showToast('Please fill in Name, Title, and Bio', 'warn');
        return;
      }
    }
    setFormStep(formStep + 1);
  };

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    } else {
      onBack();
    }
  };

  const renderStep = () => {
    switch (formStep) {
      case 0: return <StepBasicInfo userData={userData} onChange={updateUserData} />;
      case 1: return <StepLinks userData={userData} onChange={updateUserData} />;
      case 2: return <StepSkills skills={userData.skills} onUpdate={(s) => updateUserData('skills', s)} />;
      case 3: return <StepProjects projects={userData.projects} onUpdate={(p) => updateUserData('projects', p)} />;
      case 4: return <StepCertifications certifications={userData.certifications} onUpdate={(c) => updateUserData('certifications', c)} />;
      default: return null;
    }
  };

  return (
    <div>
      <TopNav step={1} onBack={handleBack} />
      <div className="form-layout">
        <div className="form-steps-bar">
          {FORM_STEPS.map((_, i) => (
            <div key={i} className={`fstep ${i < formStep ? 'done' : i === formStep ? 'active' : ''}`}></div>
          ))}
        </div>
        <h2 className="form-section-title">{FORM_STEPS[formStep]}</h2>
        <p className="form-section-sub">
          {['Tell us who you are', 'Connect your web presence', 'What are you good at?', 'Show off your work', 'Your credentials'][formStep]}
        </p>
        
        {renderStep()}

        <div className="form-footer">
          <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
          {formStep < FORM_STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>Next →</button>
          ) : (
            <TiltButton onClick={onGenerate}>✦ Generate Portfolio</TiltButton>
          )}
        </div>
      </div>
    </div>
  );
};

/* 3D tilt button wrapper */
const TiltButton = ({ onClick, children }) => {
  const ref = useRef(null);
  const animRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 … 1
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 12;
    const rotY =  dx * 12;
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(500px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.07) translateY(-3px)`;
      el.style.boxShadow = `0 ${8 + Math.abs(rotX)}px 0 #1a8a58, 0 ${16 + Math.abs(rotX)}px 32px rgba(52,211,153,.5)`;
    });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(animRef.current);
    el.style.transform = '';
    el.style.boxShadow = '';
  };

  return (
    <button
      ref={ref}
      className="btn btn-success"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default FormContainer;
