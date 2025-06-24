import React from 'react'
import { carAPI } from '../Features/cars/carApi';

const CarPage = () => {
  const { data: carsData, isLoading, error } = carAPI.useGetCarsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-950 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Luxury Cars</h1>
        <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto">
          Explore our exclusive collection of luxury cars available for rent.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
          <input
            type="text"
            placeholder="Search by car name..."
            className="w-full md:w-96 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900"
          />
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-black px-6 py-2 rounded-md font-semibold transition duration-200"
          >
            Search
          </button>
        </div>
      </header>

      <main className="px-6 py-10 max-w-7xl mx-auto">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse space-y-4">
                <div className="bg-gray-300 h-40 rounded-md"></div>
                <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
                <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 font-medium">Error fetching cars.</p>
        )}

        {!isLoading && carsData && carsData.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {carsData.map((car) => (
              <div key={car.car_id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={car.image_url}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
                  <p className="text-gray-600">{car.year}</p>
                  <p className="text-lg font-bold text-amber-500">${car.rental_rate}/day</p>
                  <button className="mt-4 w-full bg-amber-400 hover:bg-amber-500 text-black py-2 rounded-md font-medium transition duration-200">
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {!isLoading && carsData?.length === 0 && (
          <p className="text-center text-gray-600 mt-8">No cars available at the moment.</p>
        )}
      </main>
    </div>
  );
};

export default CarPage;
