import React from 'react'
import { paymentAPI } from '../../../Features/payments/paymentApi';

const Payments = () => {
    const {data:paymentsData, isLoading, error} = paymentAPI.useGetPaymentsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });

  return (
    <div>
        <h2 className='text-xl font-bold mb-4'>Payment List</h2>
        {isLoading && <p>Loading payments...</p>}
        {error && <p className='text-red-500'>Error fetching payments</p>}
        {paymentsData && paymentsData.length > 0 ? (
            <div className='overflow-x-auto'>
                <table className='table table-xs w-full'>
                    <thead>
                        <tr className='bg-gray-600 text-white text-md lg:text-lg'>
                            <th className='px-4 py-2'>Payment ID</th>
                            <th className='px-4 py-2'>User ID</th>
                            <th className='px-4 py-2'>Booking ID</th>
                            <th className='px-4 py-2'>Amount</th>
                            <th className='px-4 py-2'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentsData.map((payment) => (
                            <tr key={payment.payment_id} className='hover:bg-gray-300 border-b border-gray-400'>
                                <td className='px-4 py-2 border-r border-gray-400'>{payment.payment_id}</td>
                                <td className='px-4 py-2 border-r border-gray-400'>{payment.user_id}</td>
                                <td className='px-4 py-2 border-r border-gray-400'>{payment.booking_id}</td>
                                <td className='px-4 py-2 border-r border-gray-400'>{payment.amount}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className='text-gray-500'>No payments found</p>
        )}
      
      
    </div>
  )
}



export default Payments
