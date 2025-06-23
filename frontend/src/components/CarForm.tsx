import React from 'react'

const CarForm = () => {
  return (
    <div>

        <form className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Car Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter car name" />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter car model" />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter year of manufacture" />
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price in USD" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Add Car</button>
        </form>
      
    </div>
  )
}

export default CarForm
