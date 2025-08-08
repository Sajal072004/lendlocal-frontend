'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
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
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  
  const cleanup = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  };

  
  const startHeartbeat = (socketInstance: Socket) => {
    cleanup(); 
    
    heartbeatInterval.current = setInterval(() => {
      if (socketInstance && socketInstance.connected) {
        console.log('📱 Sending heartbeat ping');
        socketInstance.emit('ping', { timestamp: Date.now() });
      }
    }, 25000); 
  };

  
  const attemptReconnect = (socketInstance: Socket) => {
    if (reconnectTimeout.current) return; 
    
    reconnectTimeout.current = setTimeout(() => {
      if (socketInstance && !socketInstance.connected && isAuthenticated && user?._id) {
        console.log('📱 Attempting to reconnect socket...');
        socketInstance.connect();
      }
      reconnectTimeout.current = null;
    }, 2000);
  };

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      console.log('🔌 Initializing socket connection for user:', user._id);
      
      
      const newSocket = io(`${backendUrl}`, {
        
        transports: ['websocket', 'polling'], 
        upgrade: true, 
        timeout: 10000, 
        
        
        reconnection: true,
        reconnectionDelay: 1000, 
        reconnectionDelayMax: 5000, 
        
        
        
        
        
        forceNew: false, 
        rememberUpgrade: true, 
      });

      
      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        setIsConnected(true);
        
        
        newSocket.emit('joinUserRoom', user._id.toString());
        
        
        startHeartbeat(newSocket);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setIsConnected(false);
        cleanup(); 
        
        
        if (reason !== 'io client disconnect' && reason !== 'io server disconnect') {
          attemptReconnect(newSocket);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('🚨 Socket connection error:', error);
        setIsConnected(false);
        attemptReconnect(newSocket);
      });

      
      newSocket.on('pong', (data) => {
        console.log('📱 Received pong from server:', data);
      });

      
      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        startHeartbeat(newSocket);
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('🚨 Reconnection error:', error);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('💥 Failed to reconnect socket');
        setIsConnected(false);
      });

      setSocket(newSocket);

      
      const handleVisibilityChange = () => {
        if (!document.hidden && newSocket) {
          
          console.log('📱 App visible - checking socket connection');
          if (!newSocket.connected) {
            console.log('📱 Reconnecting socket after visibility change');
            newSocket.connect();
          } else {
            
            startHeartbeat(newSocket);
          }
        } else {
          
          cleanup();
        }
      };

      const handleFocus = () => {
        console.log('📱 App focused');
        if (newSocket && !newSocket.connected) {
          console.log('📱 Reconnecting socket on focus');
          newSocket.connect();
        }
      };

      const handleOnline = () => {
        console.log('📱 Network back online');
        if (newSocket && !newSocket.connected) {
          console.log('📱 Reconnecting socket - network restored');
          newSocket.connect();
        }
      };

      const handleOffline = () => {
        console.log('📱 Network offline');
        cleanup(); 
      };

      const handleBeforeUnload = () => {
        cleanup();
        if (newSocket) {
          newSocket.disconnect();
        }
      };

      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('beforeunload', handleBeforeUnload);

      
      return () => {
        console.log('🧹 Cleaning up socket connection');
        cleanup();
        
        
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        
        newSocket.disconnect();
      };
    } else if (!isAuthenticated && socket) {
      
      console.log('👋 User logged out - disconnecting socket');
      cleanup();
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, user?._id]); 

  
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};