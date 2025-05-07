import React, { useContext, useState } from 'react';
import { Web3Context } from '../context/Web3Context';
import UserRegistration from './UserRegistration';
import ItemList from './ItemList';

function Dashboard() {
  const { account, connectWallet } = useContext(Web3Context);
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {!account ? (
          <div className="text-center mb-6">
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Registration
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'items'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Items
              </button>
            </div>

            {activeTab === 'register' ? <UserRegistration /> : <ItemList />}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;