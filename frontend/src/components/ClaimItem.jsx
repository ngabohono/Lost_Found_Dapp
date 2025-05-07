import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

function ClaimItem({ itemId }) {
  const { contract, account } = useContext(Web3Context);
  const [formData, setFormData] = useState({
    proofDescription: '',
    supportingFiles: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.claimItem(itemId);
      await tx.wait();
      alert('Claim submitted successfully!');
    } catch (error) {
      console.error('Error claiming item:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Claim Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Proof of Ownership</label>
          <textarea
            value={formData.proofDescription}
            onChange={(e) => setFormData({...formData, proofDescription: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Describe specific details about the item that only the owner would know..."
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Supporting Documents</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFormData({...formData, supportingFiles: Array.from(e.target.files)})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={!account}
        >
          Submit Claim
        </button>
      </form>
    </div>
  );
}

export default ClaimItem;