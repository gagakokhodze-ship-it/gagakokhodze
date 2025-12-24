
import React, { useState, useCallback, useEffect } from 'react';
import JoinScreen from './components/JoinScreen';
import ChatRoom from './components/ChatRoom';
import { User, Message } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Simulation of a shared chat room
  // In a real app, this would be a WebSocket connection
  const handleJoin = (user: User) => {
    setCurrentUser(user);
    // Add a welcome message
    const welcomeMsg: Message = {
      id: 'system-' + Date.now(),
      senderId: 'system',
      senderName: 'System',
      text: `${user.nickname} joined the chat!`,
      originalLanguage: 'en',
      timestamp: Date.now(),
      translations: { [user.language]: `${user.nickname} შემოვიდა ჩათში!` }
    };
    setMessages(prev => [...prev, welcomeMsg]);
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const newMessage: Message = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      senderName: currentUser.nickname,
      text,
      originalLanguage: currentUser.language,
      timestamp: Date.now(),
      translations: { [currentUser.language]: text }
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate other users responding (to test translation)
    if (messages.length === 5) {
      setTimeout(() => {
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          senderId: 'bot-1',
          senderName: 'Tiko (Bot)',
          text: 'Welcome everyone! I can speak many languages too.',
          originalLanguage: 'en',
          timestamp: Date.now(),
          translations: {}
        };
        setMessages(prev => [...prev, botMsg]);
      }, 2000);
    }
  };

  const handleUpdateMessage = useCallback((updatedMsg: Message) => {
    setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      {!currentUser ? (
        <JoinScreen onJoin={handleJoin} />
      ) : (
        <ChatRoom 
          currentUser={currentUser} 
          messages={messages} 
          onSendMessage={handleSendMessage}
          onUpdateMessage={handleUpdateMessage}
          onLogout={() => setCurrentUser(null)}
        />
      )}
    </div>
  );
};

export default App;
