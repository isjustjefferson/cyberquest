import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { Protected } from './components/Protected';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Tracks } from './pages/Tracks';
import { TrackDetail } from './pages/TrackDetail';
import { Lesson } from './pages/Lesson';
import { Labs } from './pages/Labs';
import { LabDetail } from './pages/LabDetail';
import { Review } from './pages/Review';
import { DailyChallenge } from './pages/DailyChallenge';
import { Ranking } from './pages/Ranking';
import { Achievements } from './pages/Achievements';
import { Shop } from './pages/Shop';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trilhas" element={<Tracks />} />
          <Route path="/trilhas/:slug" element={<TrackDetail />} />
          <Route path="/licoes/:slug" element={<Lesson />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/labs/:slug" element={<LabDetail />} />
          <Route path="/revisao" element={<Review />} />
          <Route path="/desafio" element={<DailyChallenge />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/conquistas" element={<Achievements />} />
          <Route path="/loja" element={<Shop />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
