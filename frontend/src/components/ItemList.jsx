import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { ethers } from 'ethers';
import ReportLostItem from './ReportLostItem';
import ReportFoundItem from './ReportFoundItem';

function ItemList() {
  const { contract, account } = useContext(Web3Context);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeForm, setActiveForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'lost', or 'found'

  useEffect(() => {
    if (contract && account) {
      loadItems();
    } else {
      setIsLoading(false);
    }
  }, [contract, account]);

  const loadItems = async () => {
    if (!contract) return;
    
    try {
      setIsLoading(true);
      // Load both lost and found items
      const [lostCount, foundCount] = await Promise.all([
        contract.lostItemCount(),
        contract.foundItemCount()
      ]);

      const loadedItems = [];
      
      // Load lost items
      for (let i = 1; i <= Number(lostCount); i++) {  // Changed from 0 to 1, and < to <=
        try {
          const item = await contract.lostItems(i);
          if (item && item.name) {
            loadedItems.push({
              id: `lost-${i}`,
              title: item.name,
              description: item.description,
              location: item.location,
              reporter: item.reporter,
              isLost: true,
              isClaimed: item.resolved,
              timestamp: new Date(Number(item.dateReported) * 1000).toLocaleString()
            });
          }
        } catch (err) {
          console.error(`Error loading lost item ${i}:`, err);
        }
      }

      // Load found items
      for (let i = 1; i <= Number(foundCount); i++) {  // Changed from 0 to 1, and < to <=
        try {
          const item = await contract.foundItems(i);
          if (item && item.name) {
            loadedItems.push({
              id: `found-${i}`,
              title: item.name,
              description: item.description,
              location: item.location,
              reporter: item.finder,
              isLost: false,
              isClaimed: item.claimed,
              timestamp: new Date(Number(item.dateReported) * 1000).toLocaleString()
            });
          }
        } catch (err) {
          console.error(`Error loading found item ${i}:`, err);
        }
      }
      
      setItems(loadedItems);
      setError('');
    } catch (err) {
      console.error('Error loading items:', err);
      setError('Failed to load items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (item) => {
    try {
      if (!contract || !account) {
        setError('Please connect your wallet first');
        return;
      }

      const itemId = parseInt(item.id.split('-')[1]);
      let tx;

      if (item.isLost) {
        // For lost items, only the owner can resolve them
        if (item.reporter.toLowerCase() !== account.toLowerCase()) {
          setError('Only the reporter can resolve this lost item');
          return;
        }
        tx = await contract.resolveLostItem(itemId);
      } else {
        // For found items, anyone except the finder can claim
        tx = await contract.claimItem(itemId);
      }

      await tx.wait();
      await loadItems(); // Reload items after successful claim
      alert('Item claimed successfully!');
    } catch (err) {
      console.error('Error claiming item:', err);
      setError(err.message || 'Failed to claim item');
    }
  };

  // Add a button to report items
  const ReportButtons = () => (
    <div className="flex justify-end space-x-4 mb-6">
      <button
        onClick={() => setActiveForm('lost')}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
      >
        Report Lost Item
      </button>
      <button
        onClick={() => setActiveForm('found')}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
      >
        Report Found Item
      </button>
    </div>
  );

  // Show form based on activeForm state
  if (activeForm === 'lost') {
    return (
      <div className="container mx-auto p-4">
        <button
          onClick={() => setActiveForm(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>← Back to Items</span>
        </button>
        <ReportLostItem onSuccess={() => {
          setActiveForm(null);
          loadItems();
        }} />
      </div>
    );
  }

  if (activeForm === 'found') {
    return (
      <div className="container mx-auto p-4">
        <button
          onClick={() => setActiveForm(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>← Back to Items</span>
        </button>
        <ReportFoundItem onSuccess={() => {
          setActiveForm(null);
          loadItems();
        }} />
      </div>
    );
  }

  // Add this before the return statement
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'lost') return matchesSearch && item.isLost;
    if (filter === 'found') return matchesSearch && !item.isLost;
    return matchesSearch;
  });

  // Add search and filter controls before the main list
  const SearchAndFilterControls = () => (
    <div className="mb-6 space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Items</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>
      </div>
    </div>
  );

  // Main list view
  return (
    <div className="container mx-auto p-4">
      <ReportButtons />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
          {items.length === 0 ? (
            <>
              <p className="text-xl font-semibold mb-2">No items have been reported yet.</p>
              <p>Be the first to report a lost or found item!</p>
            </>
          ) : (
            <>
              <p className="text-xl font-semibold mb-2">No matching items found</p>
              <p>Try adjusting your search or filter criteria</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`p-4 rounded-t-lg ${
                item.isLost ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <div className={`text-sm font-semibold ${
                  item.isLost ? 'text-red-600' : 'text-green-600'
                }`}>
                  {item.isLost ? 'Lost Item' : 'Found Item'}
                </div>
                <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <p className="text-gray-700">{item.description}</p>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Location:</span> {item.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Reported by:</span>{' '}
                    <span className="font-mono">{item.reporter.slice(0, 6)}...{item.reporter.slice(-4)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Reported:</span> {item.timestamp}
                  </p>
                  {item.reward && (
                    <p className="text-sm text-green-600 font-semibold">
                      Reward: {ethers.utils.formatEther(item.reward)} ETH
                    </p>
                  )}
                </div>

                {item.isClaimed ? (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium text-gray-700">
                        {item.isLost ? 'This item has been found' : 'This item has been claimed by owner'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-2">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaim(item)}
                    className={`mt-4 w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
                      item.isLost 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {item.isLost ? 'I Found This' : 'This is Mine'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;