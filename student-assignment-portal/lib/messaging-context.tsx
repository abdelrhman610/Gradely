'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: Date;
  messages: Message[];
  unreadCount: number;
}

interface MessagingContextType {
  conversations: Conversation[];
  sendMessage: (senderId: string, senderName: string, recipientId: string, recipientName: string, content: string) => void;
  getConversation: (participantId: string) => Conversation | undefined;
  markAsRead: (conversationId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const sendMessage = (senderId: string, senderName: string, recipientId: string, recipientName: string, content: string) => {
    const conversationId = [senderId, recipientId].sort().join('-');
    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      senderName,
      recipientId,
      recipientName,
      content,
      timestamp: new Date(),
      isRead: false,
    };

    setConversations(prev => {
      const existing = prev.find(c => c.id === conversationId);
      
      if (existing) {
        return prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                lastMessage: content,
                lastMessageTime: new Date(),
              }
            : c
        );
      } else {
        return [
          ...prev,
          {
            id: conversationId,
            participantId: recipientId,
            participantName: recipientName,
            lastMessage: content,
            lastMessageTime: new Date(),
            messages: [message],
            unreadCount: 1,
          },
        ];
      }
    });
  };

  const getConversation = (participantId: string) => {
    return conversations.find(c => c.participantId === participantId);
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, isRead: true })) }
          : c
      )
    );
  };

  return (
    <MessagingContext.Provider value={{ conversations, sendMessage, getConversation, markAsRead }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
}
