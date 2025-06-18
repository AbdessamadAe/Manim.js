import React from 'react';
import { Scene, Transition, SceneCircle as Circle, SceneSquare as Square, SceneLine as Line } from '../lib/main';

const SceneDemo: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#111', 
      minHeight: '100vh',
      color: 'white'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Scene-Based Animation with Transitions
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>

        {/* Example 5:  */}
        <div>
          <h3>Morph between shapes</h3>
          <Scene width={800} height={500} duration={10}>
            {/* Initial shapes */}
            <Circle id="sqaure" x={200} y={250} radius={45} color="gold" fillColor="gold" />
            <Square id="meteor" x={600} y={250} size={80} color="silver" fillColor="silver" />
            
            {/* Target shapes */}
            <Square id="sqaureTarget" x={200} y={250} size={80} color="gold" fillColor="gold" />
            <Circle id="meteorTarget" x={600} y={250} radius={45} color="silver" fillColor="silver" />
            
            {/* Transitions */}
            <Transition
              from="sqaure"
              to="sqaureTarget"
              start={1}
              duration={2}
              type="morph"
              easing="easeInOut"
            />
            
            <Transition
              from="meteor"
              to="meteorTarget"
              start={1}
              duration={2}
              type="morph"
              easing="easeInOut"
            />
          </Scene>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#222', 
          borderRadius: '8px',
          maxWidth: '800px'
        }}>
          <h3>How to Use:</h3>
          <p>The Scene component can work with any drawable component (Circle, Square, Line, etc.):</p>
          <pre style={{ 
            backgroundColor: '#333', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
{`<Scene width={600} height={400} duration={10}>
  <Circle id="sun" x={150} y={150} radius={40} color="orange" />
  <Square id="planet" x={300} y={150} size={60} color="blue" />

  <Transition
    from="sun"
    to="planet"
    start={2}
    duration={3}
    type="morph" // or "fade", "move", "scale"
    easing="easeInOut" // or "linear", "easeIn", "easeOut"
  />
  
  <Transition
    from="trajectory"
    to="planet"
    start={6}
    duration={2}
    type="move"
    easing="easeOut"
  />
</Scene>`}
          </pre>
          
          <h4>Available Transition Types:</h4>
          <ul>
            <li><strong>morph</strong>: Smoothly transforms one shape into another</li>
            <li><strong>fade</strong>: Fades out the first shape while fading in the second</li>
            <li><strong>move</strong>: Moves the first shape to the position of the second</li>
            <li><strong>scale</strong>: Scales the shape during transition</li>
          </ul>
          
          <h4>Available Easing Functions:</h4>
          <ul>
            <li><strong>linear</strong>: Constant speed</li>
            <li><strong>easeIn</strong>: Slow start, fast end</li>
            <li><strong>easeOut</strong>: Fast start, slow end</li>
            <li><strong>easeInOut</strong>: Slow start and end, fast middle</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SceneDemo;
