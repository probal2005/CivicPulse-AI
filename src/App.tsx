import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { CitizenDashboard } from '@/pages/CitizenDashboard';
import { ReportIssuePage } from '@/pages/ReportIssuePage';
import { AdminCommandCenter } from '@/pages/AdminCommandCenter';
import { CivicMapPage } from '@/pages/CivicMapPage';
import { AIIntelligencePage } from '@/pages/AIIntelligencePage';
import { TeamPage } from '@/pages/TeamPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/admin" element={<AdminCommandCenter />} />
          <Route path="/map" element={<CivicMapPage />} />
          <Route path="/ai" element={<AIIntelligencePage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
