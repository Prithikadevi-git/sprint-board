import React from 'react';
import { Clock, User as UserIcon, X } from 'lucide-react';

const ActivityPanel = ({ activities, onClose }) => {
  // Helper to format dates nicely
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside className="w-80 border-l border-gray-200 bg-white flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <Clock size={18} className="text-blue-600" />
          <span>Activity Log</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Clock size={32} className="mb-2 opacity-20" />
            <p className="text-sm italic">No recent activity found</p>
          </div>
        ) : (
          activities.map((log) => (
            <div key={log._id} className="flex gap-3 group">
              {/* Avatar Circle */}
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-sm">
                <UserIcon size={16} />
              </div>

              {/* Text Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug">
                  <span className="font-bold text-gray-900">
                    {log.user?.name || 'System'}
                  </span>{' '}
                  <span className="text-gray-600">{log.action}</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-1.5 font-medium tracking-wide">
                  {formatTime(log.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer (Optional) */}
      <div className="p-4 border-t border-gray-50 text-center">
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          View All History
        </button>
      </div>
    </aside>
  );
};

export default ActivityPanel;