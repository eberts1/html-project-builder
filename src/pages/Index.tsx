import { useState } from 'react';
import Topbar from '@/components/layout/Topbar';
import Dashboard from '@/pages/Dashboard';
import LeiloesPage from '@/pages/LeiloesPage';
import ArquivosPage from '@/pages/ArquivosPage';
import ProjetosPage from '@/pages/ProjetosPage';
import CRMPage from '@/pages/CRMPage';
import MarketingPage from '@/pages/MarketingPage';

const Index = () => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <Topbar activePage={activePage} onPageChange={setActivePage} />
      {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
      {activePage === 'leiloes' && <LeiloesPage />}
      {activePage === 'arquivos' && <ArquivosPage />}
      {activePage === 'projetos' && <ProjetosPage />}
      {activePage === 'crm' && <CRMPage />}
      {activePage === 'marketing' && <MarketingPage />}
    </div>
  );
};

export default Index;
