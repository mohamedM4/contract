import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, Plus, Menu, X } from 'lucide-react';
import UserTableRow from './element/contract.jsx';
import { useNavigate } from 'react-router-dom';
import { getContract } from '../api/rest-service.js';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext.jsx'; 
import { useContract } from '../context/ContractContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();
  const { currentContract } = useContract();

  useEffect(() => {
    setLoading(true);
    getContract(user.id)
      .then(json => {
        if (Array.isArray(json)) {
          setContracts(json);
        } else if (json && typeof json === 'object') {
          setContracts(Object.values(json));
        } else {
          setContracts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching contracts:", err);
        setLoading(false);
      });
  }, [user.id]);

  const onEditFun = async (contract) => {
    currentContract(contract);
    console.log("Validated Data Payload ready for DB:", contract);
    navigate(`/${contract.CONTRACT_ID}/edit`);
  }; 

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans antialiased overflow-hidden relative">
      
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component (Static on Desktop, Sliding Drawer on Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo & Mobile Close Button */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-lg px-2">
              <div className="h-6 w-6 bg-neutral-900 rounded flex items-center justify-center text-white text-xs">▲</div>
              <span>Contract.</span>
            </div>
            {/* Close Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Close drawer on selection
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-dark'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-neutral-200 flex items-center gap-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-full flex-shrink-0" />
          <div className="truncate">
            <p className="text-xs font-medium text-neutral-900 truncate">Yassine Developer</p>
            <p className="text-[10px] text-neutral-400 truncate">mohamadyassinelouissi@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Navbar Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 rounded-lg text-neutral-600 hover:bg-neutral-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="font-semibold text-lg flex items-center gap-2">
            <div className="h-5 w-5 bg-neutral-900 rounded flex items-center justify-center text-white text-[10px]">▲</div>
            <span>Contract.</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-200" /> {/* Spacer or avatar */}
        </header>

        {/* Dynamic Header / Body Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Section Title & Action Button Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight capitalize">{activeTab}</h1>
              <p className="text-sm text-neutral-500">Manage your workspace seamlessly.</p>
            </div>
            
            {/* Action Button Header */}
            {(activeTab === 'contracts' || activeTab === 'dashboard') && (
              <button
                onClick={() => navigate('/contract/new')}
                className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 !text-dark px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Contract</span>
              </button>
            )}
          </div>

          {/* Conditional Content rendering based on current Tab */}
          {activeTab === 'contracts' || activeTab === 'dashboard' ? (
            <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                {/* min-w establishes a threshold so table elements do not crush each other */}
                <table className="w-full min-w-[800px] border-collapse text-left text-sm text-neutral-500">
                  <thead className="bg-neutral-50 text-xs uppercase text-neutral-700 border-b border-neutral-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium">Title</th>
                      <th scope="col" className="px-6 py-4 font-medium">ID</th>
                      <th scope="col" className="px-6 py-4 font-medium">Contract Type</th>
                      <th scope="col" className="px-6 py-4 font-medium">Start Date</th>
                      <th scope="col" className="px-6 py-4 font-medium">End Date</th>
                      <th scope="col" className="px-6 py-4 font-medium">Counterparty</th>
                      <th scope="col" className="px-6 py-4 font-medium">Status</th>
                      <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-neutral-400">Loading contracts...</td>
                      </tr>
                    ) : contracts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-neutral-400">No contracts found.</td>
                      </tr>
                    ) : (
                      contracts.map((contract) => {
                        const contractId = contract.CONTRACT_ID || contract.contractId;
                        const startDate = format(parseISO(contract.CONTRACT_START_DATE), 'PPP');
                        const endDate = format(parseISO(contract.CONTRACT_END_DATE), 'PPP');
                        return (
                          <UserTableRow 
                            key={contractId} 
                            title={contract.TITLE}
                            id={contractId}
                            contractType={contract.CONTRACT_TYPE}
                            contractStartDate={startDate}
                            status={contract.STATUS}
                            contractEndDate={endDate}
                            counterpartyName={contract.COUNTERPARTY_NAME} 
                            onEdit={() => onEditFun(contract)}
                          />
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed border-neutral-200 rounded-lg flex items-center justify-center text-sm text-neutral-400 bg-white">
              {activeTab} Content Area
            </div>
          )}

        </main>
      </div>
    </div>
  );
}