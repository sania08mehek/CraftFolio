import React, { useState, useEffect } from 'react';
import { LOADING_STEPS } from '../constants';

const Loading = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < LOADING_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 800 + Math.random() * 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentStep, onComplete]);

  return (
    <div>
      <div className="loading-page">
        <div className="forge-container">
          <div className="forge-ring"></div>
          <div className="forge-ring"></div>
          <div className="forge-ring"></div>
          <div className="forge-center">✦</div>
        </div>
        <div>
          <h2 className="loading-title" style={{ textAlign: 'center' }}>Crafting your portfolio…</h2>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '.9rem', marginTop: '.35rem' }}>
            This takes just a moment
          </p>
        </div>
        <div className="loading-steps">
          {LOADING_STEPS.map((s, i) => (
            <div key={i} className={`loading-step ${i === currentStep ? 'active' : i < currentStep ? 'done' : 'pending'}`}>
              <span className="step-icon">{i === currentStep ? '›' : i < currentStep ? '✓' : ' '}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
