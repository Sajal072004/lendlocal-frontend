'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { backendUrl } from '@/config/axiosUrl';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Connect to the socket server
      const newSocket = io(`${backendUrl}`); // Your backend URL

      newSocket.on('connect', () => {
        setIsConnected(true);
        // Join a room specific to this user to receive personal notifications
        newSocket.emit('joinUserRoom', user._id.toString());
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Disconnect when the component unmounts or user logs out
      return () => {
        newSocket.disconnect();
      };
    } else if (!isAuthenticated && socket) {
      // If user logs out, disconnect the socket
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};