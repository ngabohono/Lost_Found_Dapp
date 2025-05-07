import React from 'react'

function ReportForm() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Report Item</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input type="text" className="w-full p-2 border rounded" />
        </div>
      </form>
    </div>
  )
}

export default ReportForm