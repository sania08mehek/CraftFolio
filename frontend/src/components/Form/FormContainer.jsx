import React, { useRef } from 'react';
import StepBasicInfo      from './StepBasicInfo';
import StepContact        from './StepContact';
import StepSkills         from './StepSkills';
import StepProjects       from './StepProjects';
import StepCertifications from './StepCertifications';
import { FORM_STEPS }     from '../../constants';

// Step subtitles
const SUBS = [
  'Tell us who you are',
  'Add your contact details and social links',
  'List the technologies and tools you work with',
  'Showcase the projects you have built',
  'Add your professional certifications and credentials',
];

const FormContainer = ({ userData, onUpdate, onBack, onGenerate, showToast }) => {
  const [formStep, setFormStep] = React.useState(0);
  const topRef = useRef(null);

  const updateUserData = (field, value) => onUpdate({ ...userData, [field]: value });

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleNext = () => {
    // Validation per step
    if (formStep === 0) {
      if (!userData.name.trim() || !userData.title.trim() || !userData.bio.trim()) {
        showToast('Please fill in Name, Title, and Bio', 'warn');
        return;
      }
    }
    if (formStep === 1) {
      if (!userData.contact_email.trim()) {
        showToast('Please add your contact email', 'warn');
        return;
      }
    }
    setFormStep(f => f + 1);
    scrollTop();
  };

  const handleBack = () => {
    if (formStep > 0) { setFormStep(f => f - 1); scrollTop(); }
    else onBack();
  };

  const renderStep = () => {
    switch (formStep) {
      case 0: return <StepBasicInfo userData={userData} onChange={updateUserData} />;
      case 1: return <StepContact   userData={userData} onChange={updateUserData} />;
      case 2: return <StepSkills    skills={userData.skills} onUpdate={s => updateUserData('skills', s)} />;
      case 3: return <StepProjects  projects={userData.projects} onUpdate={p => updateUserData('projects', p)} />;
      case 4: return <StepCertifications certifications={userData.certifications} onUpdate={c => updateUserData('certifications', c)} />;
      default: return null;
    }
  };

  const isLast = formStep === FORM_STEPS.length - 1;
  const pct    = Math.round(((formStep + 1) / FORM_STEPS.length) * 100);

  return (
    <div ref={topRef}>
      <div className="form-layout">
        {/* Progress bar */}
        <div className="form-progress-bar">
          <div className="form-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Step dots */}
        <div className="form-steps-nav">
          {FORM_STEPS.map((label, i) => (
            <button
              key={i}
              className={`form-step-pill ${i === formStep ? 'active' : i < formStep ? 'done' : ''}`}
              onClick={() => i <= formStep && setFormStep(i)}
              disabled={i > formStep}
            >
              {i < formStep ? '✓' : i + 1}
              <span className="form-step-pill-label">{label}</span>
            </button>
          ))}
        </div>

        <h2 className="form-section-title">{FORM_STEPS[formStep]}</h2>
        <p className="form-section-sub">{SUBS[formStep]}</p>

        {renderStep()}

        <div className="form-footer">
          <button className="btn btn-ghost" onClick={handleBack}>← Back</button>
          {!isLast ? (
            <button className="btn btn-primary" onClick={handleNext}>Next →</button>
          ) : (
            <GenerateButton onClick={onGenerate} />
          )}
        </div>
      </div>
    </div>
  );
};

/* 3-D Generate button */
const GenerateButton = ({ onClick }) => {
  const ref    = useRef(null);
  const animRef = useRef(null);

  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const rx = -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 10;
    const ry =  ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 10;
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      el.style.transform  = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.06) translateY(-3px)`;
      el.style.boxShadow  = `0 ${8 + Math.abs(rx)}px 0 #1a8a58, 0 ${14 + Math.abs(rx)}px 28px rgba(52,211,153,.45)`;
    });
  };

  const onLeave = () => {
    const el = ref.current; if (!el) return;
    cancelAnimationFrame(animRef.current);
    el.style.transform = ''; el.style.boxShadow = '';
  };

  return (
    <button
      ref={ref}
      className="btn btn-success"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      ✦ Generate Portfolio
    </button>
  );
};

export default FormContainer;
