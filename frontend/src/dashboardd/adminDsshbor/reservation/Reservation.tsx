import React, { useState } from 'react'
import { reservationAPI } from '../../../Features/reservations/reservationAPI'



const Reservation = () => {
     const { data: reservationsData, isLoading, error } = reservationAPI.useGetReservationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });
    const [selectedReservation, setSelectedReservation] = useState(null);

  return (
    <div>
        <h2 className='text-xl font-bold mb-4'>Reservation List</h2>
    
        {isLoading && <p>Loading reservations...</p>}
        {error && <p className='text-red-500'>Error fetching reservations</p>}
        {reservationsData && reservationsData.length > 0 ? (
            <div className='overflow-x-auto'>
            <table className='table table-xs w-full'>
                <thead>
                <tr className='bg-gray-600 text-white text-md lg:text-lg'>
                    <th className='px-4 py-2'>Reservation ID</th>
                    <th className='px-4 py-2'>User ID</th>
                    <th className='px-4 py-2'>Car ID</th>
                    <th className='px-4 py-2'>Reservation Date</th>
                    <th className='px-4 py-2'>Pickup Date</th>
                    <th className='px-4 py-2'>Return Date</th>
                </tr>
                </thead>
                <tbody>
                {reservationsData.map((reservation) => (
                    <tr key={reservation.reservation_id} className='hover:bg-gray-300 border-b border-gray-400'>
                    <td className='px-4 py-2 border-r border-gray-400'>{reservation.reservation_id}</td>
                    <td className='px-4 py-2 border-r border-gray-400'>{reservation.user_id}</td>
                    <td className='px-4 py-2 border-r border-gray-400'>{reservation.car_id}</td>
                    <td className='px-4 py-2 border-r border-gray-400'>{reservation.reservation_date}</td>
                    <td className='px-4 py-2 border-r border-gray-400'>{reservation.pickup_date}</td>
                    <td className='px-4 py-2'>{reservation.return_date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : (
            <p className='text-gray-500'>No reservations found</p>
        )}
    

      
    </div>
  )
}

export default Reservation
