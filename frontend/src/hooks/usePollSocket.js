import { useEffect } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL;

export function usePollSocket(pollId, onUpdate) {
  useEffect(() => {
    if (!pollId) {
      return undefined;
    }

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'subscribe', pollId }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'poll.updated') {
        onUpdate(message.poll);
      }
    };

    return () => socket.close();
  }, [pollId, onUpdate]);
}
