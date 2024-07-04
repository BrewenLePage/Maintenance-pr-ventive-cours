import React, { useState, useEffect } from 'react';

function App() {
  const [sum, setSum] = useState(0);

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8002/ws');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSum(data.sum);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-time Sum Display</h1>
      <h1>Sum: {sum}</h1>
    </div>
  );
}

export default App;