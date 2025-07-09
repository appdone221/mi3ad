import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  eventId: string;
  eventTitle: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image';
}

export interface Conversation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage?: string;
  organizerId: string;
  organizerName: string;
  participantId: string;
  participantName: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

interface MessageContextType {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  sendMessage: (eventId: string, organizerId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversationById: (conversationId: string) => Conversation | undefined;
  getConversationByEvent: (eventId: string, organizerId: string) => Conversation | undefined;
  getUnreadCount: () => number;
  getUserConversations: () => Conversation[];
  deleteConversation: (conversationId: string) => void;
  clearAllConversations: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Mock current user data
const currentUser = {
  id: 'user1',
  name: 'Ahmed Ali',
  avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200',
  userType: 'personal',
};

// Mock organizers data
const mockOrganizers = {
  'org1': {
    id: 'org1',
    name: 'Tech Dubai',
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  'org2': {
    id: 'org2',
    name: 'Medical Association',
    avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  'org3': {
    id: 'org3',
    name: 'Cultural Center',
    avatar: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
};

// Mock events data
const mockEvents = {
  '1': {
    id: '1',
    title: 'Tech Conference 2024',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizerId: 'org1',
  },
  '2': {
    id: '2',
    title: 'Medical Symposium',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizerId: 'org2',
  },
  '3': {
    id: '3',
    title: 'Art Exhibition',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizerId: 'org3',
  },
};

// Mock initial conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv_1_org1',
    eventId: '1',
    eventTitle: 'Tech Conference 2024',
    eventImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizerId: 'org1',
    organizerName: 'Tech Dubai',
    participantId: 'user1',
    participantName: 'Ahmed Ali',
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
];

const mockMessages: { [conversationId: string]: Message[] } = {
  'conv_1_org1': [
    {
      id: '1',
      senderId: 'user1',
      senderName: 'Ahmed Ali',
      senderAvatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200',
      receiverId: 'org1',
      receiverName: 'Tech Dubai',
      eventId: '1',
      eventTitle: 'Tech Conference 2024',
      content: 'Hi! I have a question about the parking arrangements for the conference.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      read: true,
      type: 'text',
    },
    {
      id: '2',
      senderId: 'org1',
      senderName: 'Tech Dubai',
      senderAvatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
      receiverId: 'user1',
      receiverName: 'Ahmed Ali',
      eventId: '1',
      eventTitle: 'Tech Conference 2024',
      content: 'Hello Ahmed! Free parking is available in the convention center garage. Enter from the main entrance and follow the signs.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      read: true,
      type: 'text',
    },
    {
      id: '3',
      senderId: 'user1',
      senderName: 'Ahmed Ali',
      senderAvatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200',
      receiverId: 'org1',
      receiverName: 'Tech Dubai',
      eventId: '1',
      eventTitle: 'Tech Conference 2024',
      content: 'Perfect! Thank you for the quick response. Looking forward to the event!',
      timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
      read: true,
      type: 'text',
    },
    {
      id: '4',
      senderId: 'org1',
      senderName: 'Tech Dubai',
      senderAvatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
      receiverId: 'user1',
      receiverName: 'Ahmed Ali',
      eventId: '1',
      eventTitle: 'Tech Conference 2024',
      content: 'You\'re welcome! Don\'t forget to check in at the registration desk when you arrive. See you there!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: 'text',
    },
  ],
};

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>(mockMessages);

  const sendMessage = (eventId: string, organizerId: string, content: string) => {
    const event = mockEvents[eventId];
    const organizer = mockOrganizers[organizerId];
    
    if (!event || !organizer) return;

    const conversationId = `conv_${eventId}_${organizerId}`;
    
    // Check if conversation exists, if not create it
    let conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) {
      conversation = {
        id: conversationId,
        eventId,
        eventTitle: event.title,
        eventImage: event.image,
        organizerId,
        organizerName: organizer.name,
        participantId: currentUser.id,
        participantName: currentUser.name,
        unreadCount: 0,
        updatedAt: new Date(),
      };
      
      setConversations(prev => [conversation!, ...prev]);
      setMessages(prev => ({ ...prev, [conversationId]: [] }));
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: organizerId,
      receiverName: organizer.name,
      eventId,
      eventTitle: event.title,
      content,
      timestamp: new Date(),
      read: false,
      type: 'text',
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update conversation's last message and timestamp
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date(),
            }
          : conv
      )
    );
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );

    setMessages(prev => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map(msg => ({ ...msg, read: true })) || [],
    }));
  };

  const getConversationById = (conversationId: string): Conversation | undefined => {
    return conversations.find(conv => conv.id === conversationId);
  };

  const getConversationByEvent = (eventId: string, organizerId: string): Conversation | undefined => {
    const conversationId = `conv_${eventId}_${organizerId}`;
    return conversations.find(conv => conv.id === conversationId);
  };

  const getUnreadCount = (): number => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  const getUserConversations = (): Conversation[] => {
    return conversations.filter(conv => conv.participantId === currentUser.id);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[conversationId];
      return newMessages;
    });
  };

  const clearAllConversations = () => {
    setConversations([]);
    setMessages({});
  };

  return (
    <MessageContext.Provider value={{
      conversations,
      messages,
      sendMessage,
      markAsRead,
      getConversationById,
      getConversationByEvent,
      getUnreadCount,
      getUserConversations,
      deleteConversation,
      clearAllConversations,
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};