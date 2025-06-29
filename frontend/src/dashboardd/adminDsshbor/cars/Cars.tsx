import React, { useRef, useState } from 'react';
import { carAPI, type TICar } from '../../../Features/cars/carApi';
import type { CarFormHandle } from './CarForm';
import CarForm from './CarForm';

import DeleteCar from './DeleteCar';


const Cars = () => {
  const { data, isLoading, error } = carAPI.useGetCarsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });
  const [deleteCar, setDeleteCar] = useState<TICar | null>(null);

  const carFormRef = useRef<CarFormHandle>(null);
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Car List</h2>
        <DeleteCar carId={deleteCar}  />
        <button
          onClick={() => carFormRef.current?.openDialog()}
          className="btn bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Car
        </button>
      </div>

      {/* Modal Form */}
      <CarForm ref={carFormRef} />

      {isLoading && <p>Loading cars...</p>}
      {error && <p className="text-red-500">Error fetching cars</p>}

      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr className="bg-gray-600 text-white text-md lg:text-lg">
                <th className="px-4 py-2">Car ID</th>
                <th className="px-4 py-2">Make</th>
                <th className="px-4 py-2">Model</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Availability</th>
                <th className="px-4 py-2">Rental Rate</th>
                <th className="px-4 py-2">modifications</th>
              </tr>
            </thead>
            <tbody>
              {data.map((car) => (
                <tr key={car.car_id} className="hover:bg-gray-300 border-b border-gray-400">
                  <td className="px-4 py-2 border-r border-gray-400">{car.car_id}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{car.make}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{car.model}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{car.year}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{car.color}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{car.availability ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{car.rental_rate}</td>
                    <td className="px-4 py-2">
                        <button
                        onClick={() => {
                            setDeleteCar(car);
                            (document.getElementById('delete_car_modal') as HTMLDialogElement).showModal();
                        }}
                        className="btn bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                        Delete
                        </button>
                    </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No cars found</p>
      )}
    </div>
  );
};

export default Cars;
