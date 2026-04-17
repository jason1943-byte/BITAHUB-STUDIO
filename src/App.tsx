/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';

// New Console Components
import InstanceList from './components/InstanceList';
import CreateInstance from './components/CreateInstance';
import ImageMarket from './components/ImageMarket';
import ApiKeyManager from './components/ApiKeyManager';
import ModelList from './components/ModelList';
import Playground from './components/Playground';
import Billing from './components/Billing';
import BillDetails from './components/BillDetails';
import Settings from './components/Settings';

export default function App() {
  const [activePage, setActivePage] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleEnter = (tab = 'dashboard') => {
    setActiveTab(tab);
    setActivePage('dashboard');
  };

  const handleBackToHome = () => {
    setActivePage('landing');
  };

  if (activePage === 'landing') {
    return <LandingPage onEnter={handleEnter} onAuth={() => setActivePage('auth')} />;
  }

  if (activePage === 'auth') {
    return <AuthPage onBack={() => setActivePage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[var(--color-text-primary)] selection:bg-[var(--color-accent-start)]/30 overflow-hidden flex items-center justify-center relative">
      
      {/* Environment Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-[25px] brightness-[0.2]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2500&auto=format&fit=crop')" }}
        />
      </div>

      <div className="workspace w-full max-w-[1400px] h-[90vh] grid grid-cols-[280px_1fr] gap-6 p-6 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onBackToHome={handleBackToHome} />
        
        <main className="main-content flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="relative z-10">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'instances' && <InstanceList setActiveTab={setActiveTab} />}
            {activeTab === 'create-instance' && <CreateInstance setActiveTab={setActiveTab} />}
            {activeTab === 'images' && <ImageMarket setActiveTab={setActiveTab} />}
            {activeTab === 'api-keys' && <ApiKeyManager />}
            {activeTab === 'models' && <ModelList setActiveTab={setActiveTab} />}
            {activeTab === 'playground' && <Playground />}
            {activeTab === 'billing' && <Billing setActiveTab={setActiveTab} />}
            {activeTab === 'bills' && <BillDetails />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
}
