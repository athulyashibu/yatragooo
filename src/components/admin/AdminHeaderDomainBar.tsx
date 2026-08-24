import React from 'react';
import { Globe, Lock, Shield, Server, ExternalLink } from 'lucide-react';

interface AdminHeaderDomainBarProps {
  currentDomain: 'voyagego.com' | 'admin.voyagego.com';
  onSwitchDomain: (domain: 'voyagego.com' | 'admin.voyagego.com') => void;
  isAdminAuthenticated: boolean;
  adminName?: string;
  onLogoutAdmin?: () => void;
}

export const AdminHeaderDomainBar: React.FC<AdminHeaderDomainBarProps> = ({
  currentDomain,
  onSwitchDomain,
  isAdminAuthenticated,
  adminName = 'Alex Mercer (Admin)',
  onLogoutAdmin,
}) => {
  return (
    <div className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 select-none shadow-md">
      {/* Network Domain Switcher */}
      <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
          <Server className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="font-bold text-slate-200">VoyageGo Network:</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => onSwitchDomain('voyagego.com')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentDomain === 'voyagego.com'
                ? 'bg-slate-800 text-white font-bold shadow-xs border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Customer Website</span>
            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">https://voyagego.com</span>
          </button>

          <button
            onClick={() => onSwitchDomain('admin.voyagego.com')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentDomain === 'admin.voyagego.com'
                ? 'bg-orange-600 text-white font-bold shadow-xs border border-orange-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3 text-amber-300" />
            <span>Enterprise Admin Portal</span>
            <span className="text-[10px] text-orange-200/80 font-mono hidden md:inline">https://admin.voyagego.com</span>
          </button>
        </div>
      </div>

      {/* Security & Admin Session Bar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>RBAC Protected (PostgreSQL / Express API)</span>
        </div>

        {currentDomain === 'admin.voyagego.com' && isAdminAuthenticated && (
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              {adminName}
            </span>
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="text-[11px] text-slate-400 hover:text-rose-400 font-bold underline transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
