import React, { useState } from 'react';
import Chat from './components/Chat';

const CHANNELS = [
  { id: 'general', name: 'General' },
  { id: 'random', name: 'Random' },
  { id: 'engineering', name: 'Engineering' }
];

function App() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#1e1e2e', color: '#cdd6f4' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#181825', borderRight: '1px solid #313244', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #313244' }}>
          My Workspace
        </div>
        <div style={{ padding: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: '#a6adc8', marginBottom: '10px', textTransform: 'uppercase' }}>Channels</div>
          {CHANNELS.map(channel => (
            <div 
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '6px',
                marginBottom: '5px',
                backgroundColor: activeChannel === channel.id ? '#313244' : 'transparent',
                fontWeight: activeChannel === channel.id ? 'bold' : 'normal'
              }}
            >
              # {channel.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #313244', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}># {CHANNELS.find(c => c.id === activeChannel)?.name}</div>
          <div style={{ fontSize: '0.9rem', color: '#a6adc8' }}>🟢 3 Online</div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <Chat channelId={activeChannel} />
        </div>
      </div>
    </div>
  );
}

export default App;
