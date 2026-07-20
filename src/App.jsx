import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; 
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/register.jsx';
import Dashboard from './pages/dashbaord.jsx'; 
import ContractEditRows from './pages/EditContract.jsx'; 
import AddContractForm from './pages/addContract.jsx';
import { ContractProvider } from './context/ContractContext.jsx'; // 1. Import it
// 🛡️ Protected Route Guard
const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

// 🚫 Public-Only Route Guard
const PublicRoute = () => {
  const { isLoggedIn, user } = useAuth(); 
  const id = user?.id || '';
  
  return !isLoggedIn ? <Outlet /> : <Navigate to={`/${id}/dashboard`} replace />;
};

// Shared Layout Component
const RootLayout = () => {
  const { isLoggedIn, logout, user } = useAuth(); 
  const id = user?.id || '';
  
  return (
    <div style={{ padding: '0 20px', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', padding: '20px 0', borderBottom: '1px solid #eee' }}>
        {isLoggedIn ? (
          <>
            <Link to={`/${id}/dashboard`} style={{ marginRight: 'auto', textDecoration: 'none', color: '#555' }}>Dashboard</Link>
            <button 
              onClick={logout} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={{ marginRight: 'auto', textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>Home</Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#555' }}>Sign up</Link>
            <Link to="/login" style={{ textDecoration: 'none', color: '#555' }}>Log in</Link>
          </>
        )}
      </nav>
      
      <main style={{ marginTop: '20px'}}>
        <Outlet />
      </main>
    </div>
  );
};

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '40px' }}>
    <h2>😢 404 - Page Not Found</h2>
    <Link to="/">Go back home</Link>
  </div>
);

// 🆕 Small wrapper to safely grab user state inside the React tree
const NewContractWrapper = () => {
  const { user } = useAuth();
  return <AddContractForm userId={user?.id || ''} />;
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />, 
    children: [
      { index: true, element: <Home /> },
      
      // Public-only routes wrapper
      {
        element: <PublicRoute />,
        children: [
          { path: 'login', element: <Login /> }, 
          { path: 'register', element: <SignUp /> },
        ]
      },

      // Protected routes wrapper
      {
        element: <ProtectedRoute />, 
        children: [
          { path: ':userId/dashboard', element: <Dashboard /> },
          { path: ':contractId/edit', element: <ContractEditRows /> },
          { path: 'contract/new', element: <NewContractWrapper /> } // Used the wrapper here
        ],
      },       
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <ContractProvider>
        <RouterProvider router={router} />
      </ContractProvider>
    </AuthProvider>
  );
}