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

  // Clean up function
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

  // Start heartbeat to prevent mobile browser from sleeping the connection
  const startHeartbeat = (socketInstance: Socket) => {
    cleanup(); // Clear any existing heartbeat
    
    heartbeatInterval.current = setInterval(() => {
      if (socketInstance && socketInstance.connected) {
        console.log('📱 Sending heartbeat ping');
        socketInstance.emit('ping', { timestamp: Date.now() });
      }
    }, 25000); // Send ping every 25 seconds
  };

  // Handle reconnection with delay
  const attemptReconnect = (socketInstance: Socket) => {
    if (reconnectTimeout.current) return; // Already attempting reconnect
    
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
      
      // Create socket with mobile-optimized configuration
      const newSocket = io(`${backendUrl}`, {
        // Mobile-friendly transport options
        transports: ['websocket', 'polling'], // Fallback to polling for mobile
        upgrade: true, // Allow upgrade to websocket
        timeout: 10000, // 10 second connection timeout
        
        // Reconnection settings
        reconnection: true,
        reconnectionDelay: 1000, // Start with 1 second delay
        reconnectionDelayMax: 5000, // Max 5 seconds between attempts
        
        // Keep-alive settings for mobile
        // pingInterval: 25000, // Server ping interval (not supported in client options)
        
        // Connection options
        forceNew: false, // Reuse existing connections
        rememberUpgrade: true, // Remember the transport upgrade
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        setIsConnected(true);
        
        // Join user room for personal notifications
        newSocket.emit('joinUserRoom', user._id.toString());
        
        // Start heartbeat for mobile browsers
        startHeartbeat(newSocket);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        setIsConnected(false);
        cleanup(); // Stop heartbeat
        
        // Attempt reconnect if not intentional disconnect
        if (reason !== 'io client disconnect' && reason !== 'io server disconnect') {
          attemptReconnect(newSocket);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('🚨 Socket connection error:', error);
        setIsConnected(false);
        attemptReconnect(newSocket);
      });

      // Handle server pong response
      newSocket.on('pong', (data) => {
        console.log('📱 Received pong from server:', data);
      });

      // Reconnection event handlers
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

      // Mobile-specific event handlers
      const handleVisibilityChange = () => {
        if (!document.hidden && newSocket) {
          // App came to foreground
          console.log('📱 App visible - checking socket connection');
          if (!newSocket.connected) {
            console.log('📱 Reconnecting socket after visibility change');
            newSocket.connect();
          } else {
            // Restart heartbeat when app becomes visible
            startHeartbeat(newSocket);
          }
        } else {
          // App went to background - cleanup heartbeat
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
        cleanup(); // Stop heartbeat when offline
      };

      const handleBeforeUnload = () => {
        cleanup();
        if (newSocket) {
          newSocket.disconnect();
        }
      };

      // Add mobile-specific event listeners
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up socket connection');
        cleanup();
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Disconnect socket
        newSocket.disconnect();
      };
    } else if (!isAuthenticated && socket) {
      // If user logs out, disconnect the socket
      console.log('👋 User logged out - disconnecting socket');
      cleanup();
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, user?._id]); // Only depend on auth state and user ID

  // Additional cleanup on unmount
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