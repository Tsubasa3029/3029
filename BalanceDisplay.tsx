import React from 'react';

interface BalanceDisplayProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ totalIncome, totalExpense, balance }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">総収入</p>
          <p className="text-lg font-semibold text-emerald-500">{totalIncome.toLocaleString()}円</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">総支出</p>
          <p className="text-lg font-semibold text-red-500">{totalExpense.toLocaleString()}円</p>
        </div>
      </div>
      <div className="text-center border-t border-gray-200 pt-4">
        <p className="text-base text-gray-600">現在の残高</p>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
          {balance.toLocaleString()}円
        </p>
      </div>
    </div>
  );
};

export default BalanceDisplay;