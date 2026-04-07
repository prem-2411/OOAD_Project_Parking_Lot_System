import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ParkVehicle from './components/ParkVehicle';
import UnparkVehicle from './components/UnparkVehicle';
import SearchVehicle from './components/SearchVehicle';
import Admin from './components/Admin';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'park': return <ParkVehicle />;
      case 'unpark': return <UnparkVehicle />;
      case 'search': return <SearchVehicle />;
      case 'admin': return <Admin />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-title">
          PARKQ
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Overview Status
        </div>
        <div 
          className={`nav-item ${activeTab === 'park' ? 'active' : ''}`}
          onClick={() => setActiveTab('park')}
        >
          Park Vehicle
        </div>
        <div 
          className={`nav-item ${activeTab === 'unpark' ? 'active' : ''}`}
          onClick={() => setActiveTab('unpark')}
        >
          Unpark Vehicle
        </div>
        <div 
          className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search Vehicle
        </div>
        <div 
          className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          Slot Administration
        </div>
      </aside>
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
