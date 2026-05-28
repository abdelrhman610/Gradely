'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Plus, Paperclip } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Message {
  id: string;
  sender: 'teacher' | 'student';
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface StudentConversation {
  id: string;
  studentName: string;
  studentEmail: string;
  messages: Message[];
  unreadCount: number;
}

const mockStudents = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.jenkins@school.edu' },
  { id: '2', name: 'James Wilson', email: 'james.wilson@school.edu' },
  { id: '3', name: 'Emma Thompson', email: 'emma.thompson@school.edu' },
  { id: '4', name: 'Liam Brown', email: 'liam.brown@school.edu' },
  { id: '5', name: 'Olivia Martinez', email: 'olivia.martinez@school.edu' },
];

export default function TeacherMessagesPage() {
  const [conversations, setConversations] = useState<StudentConversation[]>([
    {
      id: '1',
      studentName: 'Sarah Jenkins',
      studentEmail: 'sarah.jenkins@school.edu',
      unreadCount: 1,
      messages: [
        {
          id: '1',
          sender: 'teacher',
          senderName: 'You',
          content: 'Hi Sarah! I reviewed your assignment and gave it a 92%. Great work!',
          timestamp: new Date(Date.now() - 3600000),
          isRead: true,
        },
        {
          id: '2',
          sender: 'student',
          senderName: 'Sarah Jenkins',
          content: 'Thank you! I really appreciated the feedback you gave.',
          timestamp: new Date(Date.now() - 1800000),
          isRead: false,
        },
      ],
    },
    {
      id: '2',
      studentName: 'James Wilson',
      studentEmail: 'james.wilson@school.edu',
      unreadCount: 0,
      messages: [
        {
          id: '3',
          sender: 'student',
          senderName: 'James Wilson',
          content: 'Can I get an extension on the project?',
          timestamp: new Date(Date.now() - 7200000),
          isRead: true,
        },
        {
          id: '4',
          sender: 'teacher',
          senderName: 'You',
          content: 'Of course, until Friday should be fine.',
          timestamp: new Date(Date.now() - 5400000),
          isRead: true,
        },
      ],
    },
  ]);

  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  const [selectedStudentForNew, setSelectedStudentForNew] = useState<typeof mockStudents[0] | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
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
      sender: 'teacher',
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

    addToast('Message sent to student!', 'success');
    setMessageText('');

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'student',
        senderName: selectedConversation?.studentName || 'Student',
        content: 'Thanks for your message. I will check it out!',
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
      addToast(`New message from ${selectedConversation?.studentName}`, 'info');
    }, 2000);
  };

  const handleStartNewConversation = () => {
    if (!selectedStudentForNew || !newMessageText.trim()) {
      addToast('Please select a student and type a message', 'error');
      return;
    }

    const existingConv = conversations.find(c => c.studentName === selectedStudentForNew.name);

    if (existingConv) {
      setSelectedConversationId(existingConv.id);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === existingConv.id
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    id: Date.now().toString(),
                    sender: 'teacher',
                    senderName: 'You',
                    content: newMessageText,
                    timestamp: new Date(),
                    isRead: true,
                  },
                ],
              }
            : conv
        )
      );
    } else {
      const newConv: StudentConversation = {
        id: (conversations.length + 1).toString(),
        studentName: selectedStudentForNew.name,
        studentEmail: selectedStudentForNew.email,
        unreadCount: 0,
        messages: [
          {
            id: Date.now().toString(),
            sender: 'teacher',
            senderName: 'You',
            content: newMessageText,
            timestamp: new Date(),
            isRead: true,
          },
        ],
      };
      setConversations([...conversations, newConv]);
      setSelectedConversationId(newConv.id);
    }

    addToast(`Message sent to ${selectedStudentForNew.name}!`, 'success');
    setNewMessageText('');
    setSelectedStudentForNew(null);
    setIsNewMessageOpen(false);
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-6 sm:h-8 w-6 sm:w-8" />
            Messages
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            {totalUnread > 0 ? `You have ${totalUnread} unread message${totalUnread !== 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>

        <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to Student</DialogTitle>
              <DialogDescription>Select a student and compose your message</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Select Student</label>
                <select
                  value={selectedStudentForNew?.id || ''}
                  onChange={e => {
                    const student = mockStudents.find(s => s.id === e.target.value);
                    setSelectedStudentForNew(student || null);
                  }}
                  className="w-full mt-2 p-2 border border-border rounded-lg bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a student...</option>
                  {mockStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  value={newMessageText}
                  onChange={e => setNewMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full mt-2 p-2 border border-border rounded-lg bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleStartNewConversation}
                  disabled={!selectedStudentForNew || !newMessageText.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 h-[600px]">
        <div className="md:col-span-1 flex flex-col border border-border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No conversations yet
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full text-left p-3 sm:p-4 border-b border-border hover:bg-secondary/50 transition ${
                    selectedConversationId === conv.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-sm sm:text-base">{conv.studentName}</p>
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
              ))
            )}
          </div>
        </div>

        {selectedConversation && (
          <div className="md:col-span-2 flex flex-col border border-border rounded-lg bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{selectedConversation.studentName}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{selectedConversation.studentEmail}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'teacher'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-xs sm:text-sm break-words">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'teacher' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
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
