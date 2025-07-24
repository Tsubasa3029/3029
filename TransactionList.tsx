
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onOpenTrash: () => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDeleteTransaction: (id: string) => void }> = ({ transaction, onDeleteTransaction }) => {
  const formattedDate = new Date(transaction.date).toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-grow overflow-hidden">
        <div className="flex justify-between items-start">
          <p className="font-medium text-sm text-gray-900 truncate pr-2" title={transaction.category}>
            {transaction.category}
          </p>
          <p className="text-xs text-gray-500 flex-shrink-0">{formattedDate}</p>
        </div>
        <p
          className={`text-sm font-semibold mt-0.5 ${
            transaction.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-red-500'
          }`}
        >
          {transaction.amount.toLocaleString()}円
        </p>
      </div>
      <button
        onClick={() => onDeleteTransaction(transaction.id)}
        aria-label={`${transaction.category}を削除`}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 flex-shrink-0 ml-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};


const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction, onOpenTrash }) => {
  const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

  const renderColumn = (list: Transaction[], title: string, titleColor: string, borderColor: string) => (
    <div>
      <h3 className={`text-center font-bold text-lg ${titleColor} border-b-2 ${borderColor} pb-2 mb-3`}>{title}</h3>
      <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight: '20rem' }}>
        {list.length > 0 ? (
          list.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} onDeleteTransaction={onDeleteTransaction} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4 text-sm">履歴はありません。</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">取引履歴</h2>
        <button
          onClick={onOpenTrash}
          aria-label="ゴミ箱を開く"
          className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-6">
        {renderColumn(incomeTransactions, '収入', 'text-emerald-600', 'border-emerald-200')}
        {renderColumn(expenseTransactions, '支出', 'text-red-600', 'border-red-200')}
      </div>
    </div>
  );
};

export default TransactionList;