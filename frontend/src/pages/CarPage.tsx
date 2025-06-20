import React from 'react'

const CarPage = () => {
  return (
    <div>
        <header className="w-full  bg-gray-950 text-white py-12 flex flex-col items-center pt-16">
            <div className=''>
                <h1 className="text-4xl md:text-5xl font-bold text-center">Luxury Cars</h1>
           
            <p className="text-lg md:text-xl text-center mt-4 max-w-3xl mx-auto">
            Explore our exclusive collection of luxury cars available for rent.
            </p>
           <div className="flex justify-end items-center mt-6 gap-4">
  <label className="text-gray-300 font-medium">Search:</label>
  <input
    type="text"
    placeholder="Search here by car name"
    className="bg-gray-100 border-2 border-gray-300 rounded-md px-4 py-2 text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="bg-amber-400 text-gray-950 font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
  >
    Search
  </button>
</div>
            </div>
        </header>
    
        <main className="px-4 md:px-12 lg:px-24 max-w-7xl mx-auto w-full my-8">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Car Card */}
            <div className="flex w-52 flex-col gap-4">
  <div className="skeleton h-32 w-full"></div>
  <div className="skeleton h-4 w-28"></div>
  <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div>
</div>
            </section>
        </main>
      
    </div>
  )
}

export default CarPage
