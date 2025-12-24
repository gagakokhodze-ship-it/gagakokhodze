
import React, { useEffect, useState, useMemo } from 'react';
import { Message, User } from '../types';
import { translateText } from '../services/gemini';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
  onUpdate: (msg: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser, onUpdate }) => {
  const isMine = message.senderId === currentUser.id;
  const isSystem = message.senderId === 'system';
  const [isTranslating, setIsTranslating] = useState(false);

  const displayedText = useMemo(() => {
    // If the message is in the user's language, show the original or the cached translation
    if (message.originalLanguage === currentUser.language) {
      return message.text;
    }
    return message.translations[currentUser.language] || message.text;
  }, [message, currentUser.language]);

  const needsTranslation = useMemo(() => {
    return (
      message.originalLanguage !== currentUser.language && 
      !message.translations[currentUser.language] &&
      !isSystem
    );
  }, [message, currentUser.language, isSystem]);

  useEffect(() => {
    if (needsTranslation && !isTranslating) {
      const handleTranslation = async () => {
        setIsTranslating(true);
        const translated = await translateText(message.text, currentUser.language);
        
        const updatedMessage: Message = {
          ...message,
          translations: {
            ...message.translations,
            [currentUser.language]: translated
          }
        };
        onUpdate(updatedMessage);
        setIsTranslating(false);
      };

      handleTranslation();
    }
  }, [needsTranslation, message, currentUser.language, onUpdate, isTranslating]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
          {displayedText}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2 mb-1 px-2">
        {!isMine && (
          <span className="text-xs font-bold text-gray-600">
            {message.senderName}
          </span>
        )}
        <span className="text-[10px] text-gray-400">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div 
        className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm relative group ${
          isMine 
            ? 'bg-indigo-600 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
        }`}
      >
        {isTranslating ? (
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{displayedText}</p>
        )}
        
        {/* Translation Indicator */}
        {!isMine && message.originalLanguage !== currentUser.language && (
          <div className={`mt-2 flex items-center gap-1.5 pt-1.5 border-t ${isMine ? 'border-indigo-400' : 'border-gray-100'}`}>
            <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-indigo-400"></i>
            <span className="text-[10px] opacity-60 italic">
              Translated from {message.originalLanguage.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
