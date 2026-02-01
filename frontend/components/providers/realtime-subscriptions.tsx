'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { useSocket } from '@/lib/hooks/use-socket';

export function RealtimeSubscriptions() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;
    const onChatCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };
    socket.on('chat:created', onChatCreated);
    return () => {
      socket.off('chat:created', onChatCreated);
    };
  }, [socket, queryClient]);

  return null;
}
