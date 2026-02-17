import React, { useEffect } from "react";

const ReactionTest = () => {
  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/reactions/");

    ws.onopen = () => {
      console.log("✅ Connected to Django WebSocket");
      ws.send(JSON.stringify({ message: "Hello Redis!" }));
    };

    ws.onmessage = (event) => {
      console.log("💬 Message from server:", event.data);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    // cleanup on unmount
    return () => ws.close();
  }, []);

  return (
    <div className="p-5 text-center">
      <h2>🎯 Reaction WebSocket Test</h2>
      <p>Check your browser console for messages!</p>
    </div>
  );
};

export default ReactionTest;
