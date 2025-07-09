import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface BookedTicket {
  id: string;
  ticketNumber: string;
  qrCode: string;
  eventId: string;
  eventTitle: string;
  eventTitleAr?: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  eventDate: string;
  eventTime: string;
  location: string;
  locationAr?: string;
  price: number;
  paymentMethod: string;
  status: 'confirmed' | 'pending_payment' | 'cancelled';
  eventImage?: string;
  organizer?: string;
  organizerAr?: string;
}

interface BookingContextType {
  tickets: BookedTicket[];
  addTickets: (newTickets: BookedTicket[]) => void;
  removeTicket: (ticketId: string) => void;
  updateTicketStatus: (ticketId: string, status: BookedTicket['status']) => void;
  getUpcomingTickets: () => BookedTicket[];
  getPastTickets: () => BookedTicket[];
  getTicketById: (ticketId: string) => BookedTicket | undefined;
  clearAllTickets: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<BookedTicket[]>([]);

  // Load tickets from localStorage on mount
  useEffect(() => {
    const loadTickets = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedTickets = localStorage.getItem('userTickets');
          if (storedTickets) {
            const parsedTickets = JSON.parse(storedTickets);
            setTickets(parsedTickets);
          }
        }
      } catch (error) {
        console.error('Error loading tickets:', error);
      }
    };

    loadTickets();
  }, []);

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userTickets', JSON.stringify(tickets));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('ticketsUpdated', { detail: tickets }));
      }
    } catch (error) {
      console.error('Error saving tickets:', error);
    }
  }, [tickets]);

  const addTickets = (newTickets: BookedTicket[]) => {
    setTickets(prev => [...prev, ...newTickets]);
  };

  const removeTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const updateTicketStatus = (ticketId: string, status: BookedTicket['status']) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status } : ticket
      )
    );
  };

  const getUpcomingTickets = (): BookedTicket[] => {
    const currentDate = new Date();
    return tickets.filter(ticket => new Date(ticket.eventDate) >= currentDate);
  };

  const getPastTickets = (): BookedTicket[] => {
    const currentDate = new Date();
    return tickets.filter(ticket => new Date(ticket.eventDate) < currentDate);
  };

  const getTicketById = (ticketId: string): BookedTicket | undefined => {
    return tickets.find(ticket => ticket.id === ticketId);
  };

  const clearAllTickets = () => {
    setTickets([]);
  };

  return (
    <BookingContext.Provider value={{
      tickets,
      addTickets,
      removeTicket,
      updateTicketStatus,
      getUpcomingTickets,
      getPastTickets,
      getTicketById,
      clearAllTickets,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};