import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ZoneInsightsPage } from './pages/ZoneInsightsPage';
import { AIModelInsightsPage } from './pages/AIModelInsightsPage';
import { BusinessImpactPage } from './pages/BusinessImpactPage';
import { ContactPage } from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/zones" element={<ZoneInsightsPage />} />
          <Route path="/ai-insights" element={<AIModelInsightsPage />} />
          <Route path="/business" element={<BusinessImpactPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
