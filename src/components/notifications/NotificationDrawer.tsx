import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  DollarSign,
  Gift,
  AlertTriangle,
  Ticket,
  ShieldCheck,
  X,
  CheckCheck,
  TrendingDown,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Ticket className="w-4 h-4 text-orange-500" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'refund':
        return <DollarSign className="w-4 h-4 text-blue-500" />;
      case 'price_drop':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
      case 'promo':
      case 'loyalty':
        return <Gift className="w-4 h-4 text-amber-500" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-orange-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Notifications</h3>
              <p className="text-[10px] text-slate-400">Real-time alerts & updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Controls */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filter === 'all' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filter === 'unread' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs font-semibold">No notifications found</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3 rounded-2xl transition-all cursor-pointer flex gap-3 text-xs border ${
                  item.read
                    ? 'bg-white border-transparent hover:bg-slate-50'
                    : 'bg-orange-50/50 border-orange-200/80 hover:bg-orange-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 shrink-0 h-fit">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 leading-tight">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-600 leading-snug text-[11px]">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          VoyageGo Real-Time Notification System • Encrypted
        </div>
      </div>
    </div>
  );
};
