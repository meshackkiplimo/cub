import React, { useState } from 'react';
import { reservationAPI } from '../../../Features/reservations/reservationAPI';

const Reservation = () => {
  const {
    data: reservationsData,
    isLoading,
    error,
  } = reservationAPI.useGetReservationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedReservation, setSelectedReservation] = useState(null);

  const reservations = reservationsData ?? [];

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Reservation List</h2>

      {isLoading && <p>Loading reservations...</p>}
      {error && <p className='text-red-500'>Error fetching reservations</p>}

      {reservations.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='table table-xs w-full border border-gray-300'>
            <thead>
              <tr className='bg-gray-600 text-white text-md lg:text-lg'>
                <th className='px-4 py-2'>#</th>
                <th className='px-4 py-2'>User</th>
                <th className='px-4 py-2'>Email</th>
                <th className='px-4 py-2'>Car</th>
                <th className='px-4 py-2'>Reservation Date</th>
                <th className='px-4 py-2'>Pickup Date</th>
                <th className='px-4 py-2'>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr
                  key={reservation.reservation_id}
                  className='hover:bg-gray-100 border-b border-gray-300'
                >
                  <td className='px-4 py-2'>{reservation.reservation_id}</td>
                  <td className='px-4 py-2'>
                    {reservation.user.first_name} {reservation.user.last_name}
                  </td>
                  <td className='px-4 py-2'>{reservation.user.email}</td>
                  <td className='px-4 py-2'>
                    {reservation.car.make} {reservation.car.model} ({reservation.car.year})
                  </td>
                  <td className='px-4 py-2'>{reservation.reservation_date}</td>
                  <td className='px-4 py-2'>{reservation.pickup_date}</td>
                  <td className='px-4 py-2'>{reservation.return_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p className='text-gray-500'>No reservations found</p>
      )}
    </div>
  );
};

export default Reservation;
