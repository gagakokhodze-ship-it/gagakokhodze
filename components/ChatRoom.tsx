
import React, { useState, useRef, useEffect } from 'react';
import { User, Message } from '../types';
import MessageBubble from './MessageBubble';

interface ChatRoomProps {
  currentUser: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onUpdateMessage: (updatedMsg: Message) => void;
  onLogout: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  currentUser, 
  messages, 
  onSendMessage, 
  onUpdateMessage,
  onLogout 
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-full max-w-4xl h-[85vh] flex flex-col glass-panel rounded-3xl shadow-2xl border border-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <i className="fa-solid fa-user-astronaut text-xl"></i>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">{currentUser.nickname}</h2>
            <p className="text-xs text-indigo-600 font-medium">Native Language: {currentUser.languageLabel}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          title="Leave Chat"
        >
          <i className="fa-solid fa-right-from-bracket text-xl"></i>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/30">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              currentUser={currentUser} 
              onUpdate={onUpdateMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={`Message in ${currentUser.languageLabel}...`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-indigo-600 disabled:bg-gray-300 hover:bg-indigo-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-200"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
