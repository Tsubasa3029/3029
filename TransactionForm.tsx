import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!category.trim() || !amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('有効なカテゴリーと金額を入力してください。');
      return;
    }
    setError('');
    onAddTransaction({ type, category, amount: parsedAmount });
    setCategory('');
    setAmount('');
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900">取引を追加</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">種類</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`w-full p-2.5 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                type === TransactionType.INCOME
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              収入
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`w-full p-2.5 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                type === TransactionType.EXPENSE
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              支出
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-600 mb-1">カテゴリー</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={type === TransactionType.INCOME ? '例: 給料, 副業' : '例: 食費, 家賃'}
            className="w-full bg-gray-50 border-gray-300 text-gray-900 rounded-md p-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-xs font-medium text-gray-600 mb-1">金額 (円)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例: 5000"
            className="w-full bg-gray-50 border-gray-300 text-gray-900 rounded-md p-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold py-2.5 px-4 rounded-md text-sm hover:from-emerald-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-emerald-500 transition duration-300 transform hover:scale-105"
        >
          追加する
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;