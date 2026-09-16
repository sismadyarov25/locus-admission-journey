import { useState } from 'react';
import Onboarding from './components/Onboarding';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [screen, setScreen] = useState('onboarding');
  const [results, setResults] = useState(null);

  const handleResults = (data) => {
    setResults(data);
    setScreen('results');
  };

  if (screen === 'results' && results) {
    return (
      <ResultsDashboard
        data={results}
        onBack={() => setScreen('onboarding')}
      />
    );
  }

  return <Onboarding onResults={handleResults} />;
}

export default App;
