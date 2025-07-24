
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType, ChartData, DeletedTransaction } from './types';
import TransactionForm from './components/TransactionForm';
import PieChartCard from './components/PieChartCard';
import TransactionList from './components/TransactionList';
import BalanceDisplay from './components/BalanceDisplay';
import TrashModal from './components/TrashModal';
import { INCOME_COLORS, EXPENSE_COLORS } from './constants';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: TransactionType.INCOME, category: '給料', amount: 300000, date: '2023-10-25T10:00:00.000Z' },
    { id: '2', type: TransactionType.EXPENSE, category: '家賃', amount: 80000, date: '2023-10-25T11:00:00.000Z' },
    { id: '3', type: TransactionType.EXPENSE, category: '食費', amount: 50000, date: '2023-10-24T12:30:00.000Z' },
    { id: '4', type: TransactionType.EXPENSE, category: '光熱費', amount: 15000, date: '2023-10-22T08:00:00.000Z' },
    { id: '5', type: TransactionType.INCOME, category: '副業', amount: 50000, date: '2023-10-20T18:00:00.000Z' },
    { id: '6', type: TransactionType.EXPENSE, category: '交際費', amount: 20000, date: '2023-10-18T20:00:00.000Z' },
  ]);
  const [deletedTransactions, setDeletedTransactions] = useState<DeletedTransaction[]>([]);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

  // Auto-clean trash on component mount
  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setDeletedTransactions(currentDeleted =>
      currentDeleted.filter(t => new Date(t.deletedAt) > thirtyDaysAgo)
    );
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const now = new Date().toISOString();
    setTransactions(prev => [{ ...transaction, id: now, date: now }, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete) {
      setDeletedTransactions(prev => [...prev, { ...transactionToDelete, deletedAt: new Date().toISOString() }]);
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };
  
  const restoreTransaction = (id: string) => {
    const transactionToRestore = deletedTransactions.find(t => t.id === id);
    if (transactionToRestore) {
      const { deletedAt, ...originalTransaction } = transactionToRestore;
      setTransactions(prev => [originalTransaction, ...prev]);
      setDeletedTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const permanentlyDeleteTransaction = (id: string) => {
    setDeletedTransactions(prev => prev.filter(t => t.id !== id));
  };


  const aggregateData = (type: TransactionType): ChartData[] => {
    const filtered = transactions.filter(t => t.type === type);
    const aggregated: { [key: string]: number } = {};

    filtered.forEach(t => {
      if (aggregated[t.category]) {
        aggregated[t.category] += t.amount;
      } else {
        aggregated[t.category] = t.amount;
      }
    });

    return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  };

  const incomeData = useMemo(() => aggregateData(TransactionType.INCOME), [transactions]);
  const expenseData = useMemo(() => aggregateData(TransactionType.EXPENSE), [transactions]);

  const totalIncome = useMemo(() => incomeData.reduce((sum, item) => sum + item.value, 0), [incomeData]);
  const totalExpense = useMemo(() => expenseData.reduce((sum, item) => sum + item.value, 0), [expenseData]);
  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600">
            家計簿
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">収入と支出を記録して、お金の流れを可視化しましょう。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
             <TransactionForm onAddTransaction={addTransaction} />
             <TransactionList 
               transactions={transactions} 
               onDeleteTransaction={deleteTransaction}
               onOpenTrash={() => setIsTrashModalOpen(true)}
             />
          </div>

          <main className="lg:col-span-3 flex flex-col gap-6">
            <BalanceDisplay
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <PieChartCard 
                title="収入の内訳"
                data={incomeData} 
                colors={INCOME_COLORS}
                totalAmount={totalIncome}
              />
              <PieChartCard 
                title="支出の内訳" 
                data={expenseData} 
                colors={EXPENSE_COLORS}
                totalAmount={totalExpense}
              />
            </div>
          </main>
        </div>
      </div>
      <TrashModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        deletedTransactions={deletedTransactions}
        onRestore={restoreTransaction}
        onPermanentlyDelete={permanentlyDeleteTransaction}
      />
    </div>
  );
};

export default App;