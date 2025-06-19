import React, { useState } from 'react'
import CircleDemo from './CircleDemo'
import LineDemo from './LineDemo'
import SceneDemo from './SceneDemo'
import './App.css'

function App() {
  const [activeDemo, setActiveDemo] = useState<'circle' | 'line' | 'scene' | 'text'>('text')

  return (
    <div className="App">
      <nav style={{ 
        padding: '20px', 
        backgroundColor: '#333', 
        marginBottom: '0',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center'
      }}>
        <button 
          onClick={() => setActiveDemo('scene')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeDemo === 'scene' ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Scene Demo
        </button>
        <button 
          onClick={() => setActiveDemo('circle')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeDemo === 'circle' ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Circle Demo
        </button>
        <button 
          onClick={() => setActiveDemo('line')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeDemo === 'line' ? '#4CAF50' : '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Line Demo
        </button>
      </nav>
      
      {activeDemo === 'scene' && <SceneDemo />}
      {activeDemo === 'circle' && <CircleDemo />}
      {activeDemo === 'line' && <LineDemo />}
    </div>
  )
}

export default App
