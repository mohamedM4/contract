import React, { createContext, useContext, useState } from 'react';

// 1. Create the context out here at the top level
const ContractContext = createContext(null);

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);

  // 🔑 Triggered inside your dashboard when an edit action begins
  const currentContract = (contractData) => {
    setContract(contractData);
  };

  return (
    // 2. FIXED: Changed AuthContext.Provider to ContractContext.Provider
    <ContractContext.Provider value={{ contract, currentContract }}>
      {children}
    </ContractContext.Provider>
  );
};

// 3. This hook is now perfectly safe to call from other files!
export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
};