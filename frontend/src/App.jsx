import React, { useState } from 'react';
import Landing       from './components/Landing';
import ThemePicker   from './components/Customizer/ThemePicker';
import LayoutPicker  from './components/Customizer/LayoutPicker';
import FormContainer from './components/Form/FormContainer';
import Loading       from './components/Loading';
import Output        from './components/Output';
import Toast         from './components/Toast';
import { DEFAULT_CUSTOMIZATION, DEFAULT_USER } from './constants';

function App() {
  const [route, setRoute]             = useState('landing');
  const [customization, setCustomization] = useState({ ...DEFAULT_CUSTOMIZATION });
  const [userData, setUserData]       = useState({ ...DEFAULT_USER });
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [toast, setToast]             = useState({ show: false, message: '', type: 'ok' });

  const showToast = (message, type = 'ok') => setToast({ show: true, message, type });
  const hideToast = () => setToast(t => ({ ...t, show: false }));

  const handleGenerate = async () => {
    setRoute('loading');
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ customization, userData }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedHtml(data.html);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.detail || 'Generation failed — check backend.', 'warn');
        setGeneratedHtml(null);
      }
    } catch {
      showToast('Backend unavailable. Start the server and try again.', 'warn');
      setGeneratedHtml(null);
    } finally {
      setRoute('output');
    }
  };

  const renderRoute = () => {
    switch (route) {
      case 'landing':
        return <Landing onStart={() => setRoute('theme')} />;

      case 'theme':
        return (
          <ThemePicker
            theme={customization.theme}
            onThemeChange={theme => setCustomization(c => ({ ...c, theme }))}
            onNext={() => setRoute('layouts')}
            onBack={() => setRoute('landing')}
          />
        );

      case 'layouts':
        return (
          <LayoutPicker
            customization={customization}
            onUpdate={setCustomization}
            onNext={() => setRoute('form')}
            onBack={() => setRoute('theme')}
          />
        );

      case 'form':
        return (
          <FormContainer
            userData={userData}
            onUpdate={setUserData}
            onBack={() => setRoute('layouts')}
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
            onStartOver={() => { setRoute('landing'); setGeneratedHtml(null); }}
            showToast={showToast}
          />
        );

      default:
        return <Landing onStart={() => setRoute('theme')} />;
    }
  };

  return (
    <div className={`page${route === 'output' ? ' page--output' : ''}`}>
      {renderRoute()}
      <Toast show={toast.show} message={toast.message} type={toast.type} onHide={hideToast} />
    </div>
  );
}

export default App;
