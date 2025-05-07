import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { ethers } from 'ethers';

function ReportLostItem({ onSuccess }) {
  const { contract, account } = useContext(Web3Context);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    reward: '0'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !account) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const tx = await contract.reportLostItem(
        formData.name,
        formData.description,
        formData.location
      );
      await tx.wait();
      setFormData({
        name: '',
        description: '',
        location: '',
        reward: '0'
      });
      alert('Lost item reported successfully!');
      if (onSuccess) onSuccess(); // Call the onSuccess callback
    } catch (err) {
      console.error('Error reporting lost item:', err);
      setError(err.message || 'Failed to report lost item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Lost Item</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
            placeholder="Describe the item in detail"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Where was it lost?"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Reward (ETH)
          </label>
          <input
            type="number"
            value={formData.reward}
            onChange={(e) => setFormData({...formData, reward: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.001"
            placeholder="Enter reward amount in ETH"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !account}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isLoading || !account
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

export default ReportLostItem;