import React from 'react';
import { Web3Provider } from './context/Web3Context';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white shadow-md py-8 mb-6">
          <h1 className="text-5xl font-bold text-center text-blue-600">
            Welcome to Lost && Found DApp
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Your trusted platform for lost and found items
          </p>
        </div>
        <Dashboard />
      </div>
    </Web3Provider>
  );
}

export default App;