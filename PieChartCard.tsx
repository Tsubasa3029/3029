import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface PieChartCardProps {
  title: string;
  data: ChartData[];
  colors: string[];
  totalAmount: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="#1f2937" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-xs">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-gray-800 p-2 rounded-md border border-gray-200 shadow-lg">
          <p className="font-semibold text-sm">{`${payload[0].name}`}</p>
          <p className="text-xs">{`金額: ${payload[0].value.toLocaleString()}円`}</p>
        </div>
      );
    }
    return null;
  };


const PieChartCard: React.FC<PieChartCardProps> = ({ title, data, colors, totalAmount }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col border border-gray-200">
      <h3 className="text-lg font-bold mb-1 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-2 text-base">合計: <span className="font-semibold text-gray-900">{totalAmount.toLocaleString()}円</span></p>
      <div className="w-full h-64">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                formatter={(value) => <span className="text-gray-600 ml-1 text-xs">{value}</span>}
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">データがありません。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartCard;