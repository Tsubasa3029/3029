
import React from 'react';
import { DeletedTransaction, TransactionType } from '../types';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedTransactions: DeletedTransaction[];
  onRestore: (id: string) => void;
  onPermanentlyDelete: (id: string) => void;
}

const TrashModal: React.FC<TrashModalProps> = ({ isOpen, onClose, deletedTransactions, onRestore, onPermanentlyDelete }) => {
  if (!isOpen) return null;

  const calculateDaysLeft = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const thirtyDaysLater = new Date(deletedDate);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const timeLeft = thirtyDaysLater.getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trash-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 id="trash-modal-title" className="text-xl font-bold text-gray-900">
            最近削除した項目
          </h2>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="text-gray-400 hover:text-gray-700 transition-colors rounded-full p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-5 overflow-y-auto">
          {deletedTransactions.length > 0 ? (
            <ul className="space-y-3">
              {deletedTransactions
                .sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime())
                .map(t => {
                  const daysLeft = calculateDaysLeft(t.deletedAt);
                  const originalDateFormatted = new Date(t.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                   const deletedDateFormatted = new Date(t.deletedAt).toLocaleDateString('ja-JP');

                  return (
                    <li key={t.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between transition-shadow hover:shadow-md">
                      <div className="flex-grow mr-4">
                        <div className="flex justify-between items-start">
                           <p className="font-semibold text-gray-800 truncate pr-2" title={t.category}>{t.category}</p>
                           <p className="text-xs text-gray-500 flex-shrink-0" title={`取引日: ${originalDateFormatted}`}>{originalDateFormatted}</p>
                        </div>
                        <p className={`text-sm font-medium mt-0.5 ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                          {t.amount.toLocaleString()}円
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          削除日: {deletedDateFormatted} ({daysLeft > 0 ? `残り${daysLeft}日` : 'まもなく削除'})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => onRestore(t.id)}
                          aria-label={`${t.category}を復元`}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all"
                          title="復元"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" style={{ fill: 'none' }} />
                             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                             <path d="M4 10a1 1 0 011-1h5a1 1 0 110 2H5a1 1 0 01-1-1z" />
                           </svg>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onPermanentlyDelete(t.id)}
                          aria-label={`${t.category}を完全に削除`}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                          title="完全に削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">ゴミ箱は空です。</p>
              <p className="text-xs text-gray-400 mt-2">削除された取引はここに30日間表示されます。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TrashModal;
