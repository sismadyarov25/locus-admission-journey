import { useState } from 'react';
import Onboarding from './components/Onboarding';
import ResultsDashboard from './components/ResultsDashboard';
import AdmissionRoadmap from './components/AdmissionRoadmap';

function App() {
  const [screen, setScreen] = useState('onboarding');
  const [results, setResults] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const handleResults = (data) => {
    setResults(data);
    setScreen('results');
  };

  const handleSelectUniversity = (university) => {
    setSelectedUniversity(university);
    setScreen('roadmap');
  };

  if (screen === 'roadmap' && selectedUniversity) {
    return (
      <AdmissionRoadmap
        university={selectedUniversity}
        onBack={() => setScreen('results')}
      />
    );
  }

  if (screen === 'results' && results) {
    return (
      <ResultsDashboard
        data={results}
        onBack={() => setScreen('onboarding')}
        onSelectUniversity={handleSelectUniversity}
      />
    );
  }

  return <Onboarding onResults={handleResults} />;
}

export default App;
