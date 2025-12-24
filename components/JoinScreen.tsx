
import React, { useState } from 'react';
import { User, SUPPORTED_LANGUAGES } from '../types';

interface JoinScreenProps {
  onJoin: (user: User) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ onJoin }) => {
  const [nickname, setNickname] = useState('');
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    onJoin({
      id: Math.random().toString(36).substr(2, 9),
      nickname: nickname.trim(),
      language: selectedLang.code,
      languageLabel: selectedLang.label
    });
  };

  return (
    <div className="max-w-md w-full glass-panel rounded-3xl shadow-2xl overflow-hidden p-8 border border-white">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
          <i className="fa-solid fa-comments-text text-white text-4xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">PolyglotChat</h1>
        <p className="text-gray-500 mt-2">Connect globally, speak locally</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nickname</label>
          <input
            type="text"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="How should we call you?"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Native Language</label>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                  selectedLang.code === lang.code
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <span>Start Chatting</span>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>

      <p className="text-xs text-center text-gray-400 mt-8">
        All messages will be automatically translated to {selectedLang.label}
      </p>
    </div>
  );
};

export default JoinScreen;
