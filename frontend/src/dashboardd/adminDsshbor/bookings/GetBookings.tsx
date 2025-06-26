import React, { useState } from 'react'
import { bookingAPI } from '../../../Features/bookings/bookingAPI'
import  type { TIBooking } from '../../../Features/bookings/bookingAPI'

const GetBookings = () => {
  const {data:bookingsData, isLoading, error} = bookingAPI.useGetBookingsQuery(undefined,{
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,

  })
  const [selectedBooking, setSelectedBooking] = useState<TIBooking | null> (null);



  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Booking List</h2>

      {isLoading && <p>Loading bookings...</p>}
      {error && <p className='text-red-500'>Error fetching bookings</p>}
      {bookingsData && bookingsData.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='table table-xs w-full'>
            <thead>
              <tr className='bg-gray-600 text-white text-md lg:text-lg'>
                <th className='px-4 py-2'>Booking ID</th>
                <th className='px-4 py-2'>USER ID</th>
                <th className='px-4 py-2'>Car ID</th>
                <th className='px-4 py-2'>Rental Start Date</th>
                <th className='px-4 py-2'>Rental End Date</th>
                <th className='px-4 py-2'>Total Amount</th>
                <th className='px-4 py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookingsData.map((booking: TIBooking) => (
                <tr key={booking.booking_id} className='hover:bg-gray-300 border-b border-gray-400'>
                  <td className='px-4 py-2 border-r border-gray-400'>{booking.booking_id}</td>
                  <td className='px-4 py-2 border-r border-gray-400'>{booking.user_id}</td>
                  <td className='px-4 py-2 border-r border-gray-400'>{booking.car_id}</td>
                  <td className='px-4 py-2 border-r border-gray-400'>{booking.rental_start_date}</td>
                  <td className='px-4 py-2 border-r border-gray-400'>{booking.rental_end_date}</td>
                  <td className='px-4 py-2 border-r border-gray-400'>{booking.total_amount}</td>
                  <td className='px-4 py-2'>
                    <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : booking.status === 'cancelled' ? 'badge-error' : 'badge-warning'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        
    </div>
      ) : (
        <p className='text-gray-500'>No bookings found</p>
      )}
    </div>

  )
}

export default GetBookings
