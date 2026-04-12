import React, { useState } from 'react';
import Landing from './components/Landing';
import Customizer from './components/Customizer/Customizer';
import FormContainer from './components/Form/FormContainer';
import Loading from './components/Loading';
import Output from './components/Output';
import Toast from './components/Toast';
import { DEFAULT_CUSTOMIZATION, DEFAULT_USER } from './constants';

function App() {
  const [route, setRoute] = useState('landing');
  const [customization, setCustomization] = useState({ ...DEFAULT_CUSTOMIZATION });
  const [userData, setUserData] = useState({ ...DEFAULT_USER });
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'ok' });

  const showToast = (message, type = 'ok') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleGenerate = async () => {
    setRoute('loading');
    // The actual generation would happen here by calling the backend
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customization, userData })
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedHtml(data.html);
      } else {
        showToast('Generation failed. Using demo mode.', 'warn');
      }
    } catch (err) {
      console.error(err);
      showToast('Backend unavailable. Using demo mode.', 'warn');
    }
  };

  const renderRoute = () => {
    switch (route) {
      case 'landing':
        return <Landing onStart={() => setRoute('customize')} />;
      case 'customize':
        return (
          <Customizer 
            customization={customization} 
            onUpdate={setCustomization} 
            onNext={() => setRoute('form')} 
            onBack={() => setRoute('landing')}
          />
        );
      case 'form':
        return (
          <FormContainer 
            userData={userData} 
            onUpdate={setUserData} 
            onBack={() => setRoute('customize')} 
            onGenerate={handleGenerate}
            showToast={showToast}
          />
        );
      case 'loading':
        return <Loading onComplete={() => setRoute('output')} />;
      case 'output':
        return (
          <Output 
            generatedHtml={generatedHtml} 
            customization={customization}
            onBack={() => setRoute('form')}
            onStartOver={() => setRoute('landing')}
            showToast={showToast}
          />
        );
      default:
        return <Landing onStart={() => setRoute('customize')} />;
    }
  };

  return (
    <div className="page">
      {renderRoute()}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onHide={hideToast} 
      />
    </div>
  );
}

export default App;
