import React from 'react';

const StatCard = ({ title, value, color = '#111827' }) => (
  <div className="bg-white p-6 border-r border-gray-100 last:border-r-0 flex-1 min-w-[200px]">
    <div className="uppercase text-[10px] text-gray-400 font-semibold tracking-wider mb-2">
      {title}
    </div>
    <div className="text-[28px] font-medium" style={{ color }}>
      {value}
    </div>
  </div>
);

const StatsCards = () => {
  const stats = [
    { title: 'Total Records', value: '1,284' },
    { title: 'Active Sessions', value: '42' },
    { title: 'Pending Audit', value: '12', color: '#B91C1C' },
    { title: 'Last Update', value: '2023-10-24 14:32' },
  ];

  return (
    <div className="flex border border-gray-200 rounded-lg bg-white mb-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;