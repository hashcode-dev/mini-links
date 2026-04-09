import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LinkAnalytics from './pages/LinkAnalytics';
import Links from './pages/Links';
import QRCode from './pages/QRCode';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="links" element={<Links />} />
          <Route path="links/:id" element={<LinkAnalytics />} />
          <Route path="qr" element={<QRCode />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
