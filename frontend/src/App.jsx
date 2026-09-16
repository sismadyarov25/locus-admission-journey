import { useState } from 'react';
import Onboarding from './components/Onboarding';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [screen, setScreen] = useState('onboarding');

  if (screen === 'results') {
    return <ResultsDashboard onBack={() => setScreen('onboarding')} />;
  }

  return <Onboarding onSubmit={() => setScreen('results')} />;
}

export default App;
