
import React, { useState, useEffect } from 'react';
import { Incident, Impact, Urgency, Comment, User } from '../types';
import StatusBadge from './StatusBadge';
import { getAgentAssist } from '../services/geminiService';

interface Props {
  incident: Incident;
  onClose: () => void;
  onUpdate: (inc: Incident) => void;
  user: User;
}

const IncidentForm: React.FC<Props> = ({ incident, onClose, onUpdate, user }) => {
  const [formData, setFormData] = useState<Incident>(incident);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [assistData, setAssistData] = useState<any>(null);
  const [loadingAssist, setLoadingAssist] = useState(false);

  const isNew = incident.state === 'New' && incident.comments.length === 0 && !incident.short_description;
  const isPortalUser = user.role !== 'admin';

  useEffect(() => {
    if (!formData.short_description && !formData.description) return;
    const fetchAssist = async () => {
      setLoadingAssist(true);
      const data = await getAgentAssist(formData.description, formData.short_description);
      setAssistData(data);
      setLoadingAssist(false);
    };
    const timer = setTimeout(fetchAssist, 1000);
    return () => clearTimeout(timer);
  }, [formData.description, formData.short_description]);

  const handleUpdate = () => {
    if (isNew && !formData.short_description) {
      alert('Please provide a short description.');
      return;
    }
    onUpdate(formData);
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: user.name,
      timestamp: new Date().toISOString(),
      isInternal: isPortalUser ? false : isInternal
    };
    const updated = { ...formData, comments: [...formData.comments, comment] };
    setFormData(updated);
    setNewComment('');
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-300">
      <div className="h-12 border-b border-slate-200 flex items-center px-4 md:px-6 justify-between bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <button onClick={onClose} className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex flex-col truncate">
            <h1 className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-2 truncate">
              {isNew ? 'New Incident' : formData.number}
              {!isNew && <StatusBadge status={formData.state} />}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleUpdate} className="px-3 md:px-4 py-1.5 bg-indigo-600 text-white text-[10px] md:text-[11px] font-bold rounded shadow hover:bg-indigo-700 transition-all active:scale-95">
            {isNew ? 'Submit' : 'Update'}
          </button>
          <button onClick={onClose} className="px-3 md:px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-[10px] md:text-[11px] font-bold rounded hover:bg-slate-50">Cancel</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#f0f3f4] p-3 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="flex-1 flex flex-col gap-4 md:gap-6">
          <div className="bg-white rounded p-4 md:p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Number</label>
                <input readOnly value={formData.number} className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Caller</label>
                <input readOnly={isPortalUser} value={formData.caller} onChange={e => setFormData({...formData, caller: e.target.value})} className={`w-full border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-indigo-500 ${isPortalUser ? 'bg-slate-50 text-slate-500' : ''}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Configuration Item (CI)</label>
                <input value={formData.cmdb_ci} onChange={e => setFormData({...formData, cmdb_ci: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs outline-none font-mono" placeholder="Affected equipment ID" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Category / Service</label>
                <input readOnly={isPortalUser} value={formData.business_service} onChange={e => setFormData({...formData, business_service: e.target.value})} className={`w-full border border-slate-300 rounded px-2 py-1 text-xs outline-none ${isPortalUser ? 'bg-slate-50 text-slate-500' : ''}`} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Short Description</label>
              <input value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-semibold outline-none focus:border-indigo-500" placeholder="Summarize the issue" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-300 rounded px-2 py-2 text-xs h-24 outline-none resize-none focus:border-indigo-500" placeholder="Provide full details..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Impact</label>
                <select disabled={isPortalUser} value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value as Impact})} className={`w-full border border-slate-300 rounded px-1 py-1 text-[10px] outline-none ${isPortalUser ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}>
                  <option>1 - Extensive/Widespread</option>
                  <option>2 - Significant/Large</option>
                  <option>3 - Moderate/Limited</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Urgency</label>
                <select disabled={isPortalUser} value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value as Urgency})} className={`w-full border border-slate-300 rounded px-1 py-1 text-[10px] outline-none ${isPortalUser ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}>
                  <option>1 - High</option>
                  <option>2 - Medium</option>
                  <option>3 - Low</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Priority</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={formData.priority} className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-[10px] font-bold text-slate-700 outline-none" />
                  {isPortalUser && (
                    <i className="fa-solid fa-lock text-slate-300 text-[10px]" title="Priority is determined by Service Desk"></i>
                  )}
                </div>
              </div>
            </div>
            {isPortalUser && (
              <p className="text-[9px] text-slate-400 italic mt-2">
                * Priority is calculated automatically by IT based on your Impact and Urgency selections.
              </p>
            )}
          </div>

          {!isNew && (
            <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden flex flex-col mb-6">
              <div className="flex border-b border-slate-200">
                {!isPortalUser && (
                  <button 
                    onClick={() => setIsInternal(true)}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase transition-colors ${isInternal ? 'bg-amber-50 text-amber-800 border-b-2 border-amber-500' : 'text-slate-400'}`}
                  >
                    Work Notes (Internal)
                  </button>
                )}
                <button 
                  onClick={() => setIsInternal(false)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase transition-colors ${!isInternal || isPortalUser ? 'bg-purple-50 text-purple-800 border-b-2 border-purple-500' : 'text-slate-400'}`}
                >
                  {isPortalUser ? "Activity & Conversation" : "Additional Comments (Customer Visible)"}
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="relative">
                  <textarea 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder={isPortalUser ? "Type a message for IT Support..." : (isInternal ? "Internal diary notes..." : "Comments visible to the caller...")}
                    className="w-full border border-slate-300 rounded p-3 text-xs h-20 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                  <button 
                    onClick={addComment}
                    className="absolute bottom-3 right-3 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded hover:bg-indigo-700"
                  >
                    Post
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {[...formData.comments]
                    .filter(c => !isPortalUser || !c.isInternal)
                    .reverse()
                    .map(comment => (
                    <div key={comment.id} className={`p-3 rounded border-l-4 text-xs ${comment.isInternal ? 'bg-amber-50 border-amber-400' : 'bg-purple-50 border-purple-400'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-slate-700">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">{new Date(comment.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {!isPortalUser && (
          <div className="w-full lg:w-80 space-y-4 md:space-y-6">
            <div className="bg-white rounded shadow-sm border border-slate-200 p-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                Agent Assist
                <i className="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
              </h3>
              
              {loadingAssist ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-16 bg-slate-100 rounded w-full"></div>
                </div>
              ) : assistData ? (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50 rounded border border-indigo-100">
                    <div className="text-[9px] font-bold text-indigo-500 uppercase mb-1">Recommended CI</div>
                    <div className="text-xs font-mono font-bold text-indigo-900">{assistData.suggestedCI}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Fault Analysis</div>
                    <p className="text-[11px] text-slate-600 leading-tight">{assistData.faultAnalysis}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assistData.kbKeywords.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[9px] text-slate-500 border border-slate-200">
                        KB: {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-4 italic">
                  {isNew ? 'Drafting assist...' : 'No assist data available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentForm;
