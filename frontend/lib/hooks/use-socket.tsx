'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  io,
  type Socket,
} from 'socket.io-client';

import { env } from '../config/env.config';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket() {
  const ctx = useContext(SocketContext);
  return ctx ?? { socket: null, isConnected: false };
}

interface RealtimeProviderProps {
  userId: string | undefined;
  children: React.ReactNode;
}

export function RealtimeProvider({ userId, children }: RealtimeProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const instanceRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      instanceRef.current?.disconnect();
      instanceRef.current = null;
      queueMicrotask(() => {
        setSocket(null);
        setIsConnected(false);
      });
      return;
    }

    const s = io(env.accountBackendUrl, {
      auth: { userId },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));

    instanceRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
      instanceRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [userId]);

  const value = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
