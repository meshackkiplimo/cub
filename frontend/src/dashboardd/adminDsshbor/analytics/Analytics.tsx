import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { UserApi } from '../../../Features/users/userApi';
import { bookingAPI } from '../../../Features/bookings/bookingAPI';
import { carAPI } from '../../../Features/cars/carApi';
import { paymentAPI } from '../../../Features/payments/paymentApi';

// Colors for Pie Chart
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

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

  // Sample time-series data for line chart (you can modify this based on your actual data)
  const timeSeriesData = [
    { month: 'Jan', users: users?.length * 0.8 || 0, bookings: bookings?.length * 0.7 || 0 },
    { month: 'Feb', users: users?.length * 0.85 || 0, bookings: bookings?.length * 0.75 || 0 },
    { month: 'Mar', users: users?.length * 0.9 || 0, bookings: bookings?.length * 0.8 || 0 },
    { month: 'Apr', users: users?.length * 0.95 || 0, bookings: bookings?.length * 0.85 || 0 },
    { month: 'May', users: users?.length || 0, bookings: bookings?.length || 0 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryData.map((item) => (
          <div key={item.label} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-2xl">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview Bar Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summaryData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Users & Bookings Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#4F46E5" name="Users" />
            <Line type="monotone" dataKey="bookings" stroke="#10B981" name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Data Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={summaryData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {summaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;