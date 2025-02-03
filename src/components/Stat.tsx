import React from 'react';
import { useStats } from '../hooks/useStats';

const Stats: React.FC = () => {
  const { stats, isLoading, error } = useStats();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Statistics</h1>
      <p>Total Products: {stats?.totalProducts}</p>
      <p>Total Orders: {stats?.totalOrders}</p>
      <p>Total Revenue: {stats?.totalRevenue}</p>
    </div>
  );
};

export default Stats;