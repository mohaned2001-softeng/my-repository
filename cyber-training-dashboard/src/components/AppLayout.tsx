import React, { useEffect, useRef, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedLabs from './FeaturedLabs';
import StatsSection from './StatsSection';
import SkillsSection from './SkillsSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import LabsPage from './LabsPage';
import LabDetail from './LabDetail';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import AboutPage from './AboutPage';
import Footer from './Footer';
import { useLab } from '@/contexts/LabContext';
import { useLabs } from '@/contexts/LabsContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const { fetchLabs } = useLab();
  const { labs, setLabs } = useLabs();
  const labsRequestRef = useRef(false);

  useEffect(() => {
    if (labs.length || labsRequestRef.current) {
      return;
    }
    labsRequestRef.current = true;
    let isActive = true;
    const loadLabs = async () => {
      try {
        const data = await fetchLabs();
        if (isActive) {
          setLabs(data);
        }
      } catch (error) {
        console.error('Failed to load labs', error);
        labsRequestRef.current = false;
      }
    };
    loadLabs();
    return () => {
      isActive = false;
    };
  }, [labs.length, fetchLabs, setLabs]);

  const handleLabClick = (labId: string) => {
    setSelectedLab(labId);
    setCurrentPage('labDetail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onExplore={() => setCurrentPage('labs')} />
            <FeaturedLabs onLabClick={handleLabClick} onViewAll={() => setCurrentPage('labs')} />
            <StatsSection />
            <SkillsSection />
            <TestimonialsSection />
            <CTASection onGetStarted={() => setCurrentPage('login')} />
          </>
        );
      case 'labs':
        return <LabsPage onLabClick={handleLabClick} />;
      case 'labDetail':
        return selectedLab ? (
          <LabDetail labId={selectedLab} onBack={() => setCurrentPage('labs')} onLogin={() => setCurrentPage('login')} />
        ) : null;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <AuthForm onSuccess={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <Dashboard onLabClick={handleLabClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default AppLayout;
