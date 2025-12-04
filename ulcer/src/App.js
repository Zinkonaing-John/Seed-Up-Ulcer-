import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient/:patientId" element={<PatientDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
