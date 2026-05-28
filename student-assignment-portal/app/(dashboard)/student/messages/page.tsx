'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Paperclip } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface Message {
  id: string;
  sender: 'student' | 'teacher';
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  teacherName: string;
  teacherEmail: string;
  messages: Message[];
  unreadCount: number;
}

export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      teacherName: 'Dr. Michael Johnson',
      teacherEmail: 'michael.johnson@school.edu',
      unreadCount: 2,
      messages: [
        {
          id: '1',
          sender: 'teacher',
          senderName: 'Dr. Michael Johnson',
          content: 'Hi Sarah! I reviewed your assignment and gave it a 92%. Great work!',
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
        },
        {
          id: '2',
          sender: 'teacher',
          senderName: 'Dr. Michael Johnson',
          content: 'Remember to submit the next assignment by Friday.',
          timestamp: new Date(Date.now() - 1800000),
          isRead: false,
        },
      ],
    },
    {
      id: '2',
      teacherName: 'Prof. Emily Davis',
      teacherEmail: 'emily.davis@school.edu',
      unreadCount: 0,
      messages: [
        {
          id: '3',
          sender: 'student',
          senderName: 'You',
          content: 'Hi Prof. Davis, can I submit my project one day late?',
          timestamp: new Date(Date.now() - 7200000),
          isRead: true,
        },
        {
          id: '4',
          sender: 'teacher',
          senderName: 'Prof. Emily Davis',
          content: 'Of course! Just make sure to include a note explaining the delay.',
          timestamp: new Date(Date.now() - 5400000),
          isRead: true,
        },
      ],
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  const { addToast } = useToast();

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map(msg => ({ ...msg, isRead: true })),
            }
          : conv
      )
    );
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      addToast('Please type a message', 'error');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'student',
      senderName: 'You',
      content: messageText,
      timestamp: new Date(),
      isRead: true,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );

    addToast('Message sent!', 'success');
    setMessageText('');

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'teacher',
        senderName: selectedConversation?.teacherName || 'Teacher',
        content: 'Thanks for your message! I will get back to you soon.',
        timestamp: new Date(),
        isRead: false,
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversationId
            ? {
                ...conv,
                messages: [...conv.messages, replyMessage],
                unreadCount: conv.unreadCount + 1,
              }
            : conv
        )
      );
      addToast(`New message from ${selectedConversation?.teacherName}`, 'info');
    }, 2000);
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="h-6 sm:h-8 w-6 sm:w-8" />
          Messages
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {totalUnread > 0 ? `You have ${totalUnread} unread message${totalUnread !== 1 ? 's' : ''}` : 'All messages read'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 h-[600px]">
        <div className="md:col-span-1 flex flex-col border border-border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Your Teachers</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`w-full text-left p-3 sm:p-4 border-b border-border hover:bg-secondary/50 transition ${
                  selectedConversationId === conv.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">{conv.teacherName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {conv.messages[conv.messages.length - 1]?.content.substring(0, 40)}...
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedConversation && (
          <div className="md:col-span-2 flex flex-col border border-border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{selectedConversation.teacherName}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{selectedConversation.teacherEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'student'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-xs sm:text-sm break-words">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'student' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  className="bg-secondary border-border text-xs sm:text-sm"
                />
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 flex-shrink-0"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Paperclip className="h-4 w-4 mr-1" />
                  Attach
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
