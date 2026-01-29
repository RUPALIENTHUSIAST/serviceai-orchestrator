
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot', text: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `You are a BT Support assistant. Help users with questions about BT services, broadband, hardware, and support. User question: ${userMessage}` }] }]
      });
      
      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#5514B4] text-white rounded-full shadow-lg hover:bg-[#4411a0] transition-all flex items-center justify-center z-50"
      >
        {isOpen ? <i className="fa-solid fa-times text-xl"></i> : <i className="fa-solid fa-comments text-xl"></i>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50">
          <div className="bg-[#5514B4] text-white p-4 rounded-t-xl flex items-center gap-2">
            <i className="fa-solid fa-robot"></i>
            <span className="font-bold">BT Support Assistant</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm mt-8">
                Hi! How can I help you today?
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-[#5514B4] text-white' : 'bg-slate-100 text-slate-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 p-3 rounded-lg text-sm">
                  <i className="fa-solid fa-spinner fa-spin"></i> Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#5514B4]"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 bg-[#5514B4] text-white rounded-lg hover:bg-[#4411a0] transition-colors disabled:opacity-50"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
