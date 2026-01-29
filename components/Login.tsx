
import React from 'react';
import { Role } from '../types';

interface Props {
  onLogin: (role: Role) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-8 text-center bg-[#293e40] text-white">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <i className="fa-solid fa-shield-halved text-3xl text-indigo-300"></i>
          </div>
          <h1 className="text-2xl font-bold">ServiceNow</h1>
          <p className="text-indigo-200 text-sm mt-1">BT Group | Openreach Access</p>
        </div>
        
        <div className="p-8 space-y-4">
          <div className="text-center">
            <h2 className="text-slate-800 font-semibold mb-2">Select Persona to Begin Session</h2>
            <p className="text-slate-500 text-xs">Simulating Incident Management lifecycle.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => onLogin('admin')}
              className="group flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">ITIL Agent / Resolver</div>
                <div className="text-[10px] text-slate-500">Manage queue, SLAs, and CMDB.</div>
              </div>
            </button>

            <button 
              onClick={() => onLogin('employee')}
              className="group flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Internal Employee</div>
                <div className="text-[10px] text-slate-500">Request hardware and report facility issues.</div>
              </div>
            </button>

            <button 
              onClick={() => onLogin('end_user')}
              className="group flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-user"></i>
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Service Portal User</div>
                <div className="text-[10px] text-slate-500">Report outages and track external services.</div>
              </div>
            </button>
          </div>

          <div className="text-center pt-2">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Secure Instance Node: LON_BT_PROD_02
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
