import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

function ReportFoundItem({ onSuccess }) {
  const { contract, account } = useContext(Web3Context);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    dateFound: '',
    location: '',
    storageLocation: '',
    contactPreference: 'email',
    photo: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.reportFoundItem(
        formData.itemName,
        formData.description,
        formData.location
      );
      await tx.wait();
      alert('Found item reported successfully!');
      setFormData({
        itemName: '',
        description: '',
        dateFound: '',
        location: '',
        storageLocation: '',
        contactPreference: 'email',
        photo: null
      });
      if (onSuccess) onSuccess(); // Call the onSuccess callback
    } catch (error) {
      console.error('Error reporting found item:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Item Name</label>
          <input
            type="text"
            value={formData.itemName}
            onChange={(e) => setFormData({...formData, itemName: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Date Found</label>
          <input
            type="date"
            value={formData.dateFound}
            onChange={(e) => setFormData({...formData, dateFound: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Found Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Storage Location</label>
          <input
            type="text"
            value={formData.storageLocation}
            onChange={(e) => setFormData({...formData, storageLocation: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Contact Preference</label>
          <select
            value={formData.contactPreference}
            onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="wallet">Wallet Address</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
          disabled={!account}
        >
          Submit Found Item
        </button>
      </form>
    </div>
  );
}

export default ReportFoundItem;