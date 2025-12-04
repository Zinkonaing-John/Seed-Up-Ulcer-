import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './components/Dashboard';
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
