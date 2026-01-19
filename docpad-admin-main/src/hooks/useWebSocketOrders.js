import { useEffect, useRef, useState } from "react";

export default function useWebSocketOrders(roomId) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const WS_URL = `ws://127.0.0.1:8000/ws/orders/${roomId}/`;

    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      console.log("WS Connected");
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    wsRef.current.onclose = () => {
      console.log("WS Disconnected");
    };

    return () => wsRef.current?.close();
  }, [roomId]);

  const sendMessage = (action, payload) => {
    wsRef.current?.send(
      JSON.stringify({
        action,
        ...payload,
      })
    );
  };

  return { messages, sendMessage };
}
