import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { UserApi } from '../../../Features/users/userApi';
import { bookingAPI } from '../../../Features/bookings/bookingAPI';
import { carAPI } from '../../../Features/cars/carApi';
import { paymentAPI } from '../../../Features/payments/paymentApi';

const Analytics = () => {
  const { data: users } = UserApi.useGetUsersQuery();
  const { data: bookings } = bookingAPI.useGetBookingsQuery();
  const { data: cars } = carAPI.useGetCarsQuery();
  const { data: payments } = paymentAPI.useGetPaymentsQuery();

  const summaryData = [
    { label: 'Users', value: users?.length || 0 },
    { label: 'Cars', value: cars?.length || 0 },
    { label: 'Bookings', value: bookings?.length || 0 },
    { label: 'Payments', value: payments?.length || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryData.map((item) => (
          <div key={item.label} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-2xl">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Overview Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summaryData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
