import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Dashboard from "./components/Dashboard";
import PatientDetail from "./pages/PatientDetail";
import PatientList from "./pages/PatientList";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
