import React from 'react';
import { Line, Circle, Colors } from '../lib/main';

const LineDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>ManimJs Line Components Demo</h1>
      
      <div style={{ marginBottom: '20px', color: 'white' }}>
        <p>This demo showcases the Line component using the shared architecture with Circle.</p>
        <p>Both components extend from <code>DrawableBase</code> and use shared utilities.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Basic horizontal line */}
        <div>
          <h3 style={{ color: 'white' }}>Horizontal Line</h3>
          <Line
            x1={50}
            y1={150}
            x2={250}
            y2={150}
            color={Colors.CYAN}
            strokeWidth={4}
            duration={2}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Diagonal line */}
        <div>
          <h3 style={{ color: 'white' }}>Diagonal Line</h3>
          <Line
            x1={50}
            y1={50}
            x2={250}
            y2={250}
            color={Colors.RED}
            strokeWidth={3}
            duration={1.5}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Vertical line */}
        <div>
          <h3 style={{ color: 'white' }}>Vertical Line</h3>
          <Line
            x1={150}
            y1={50}
            x2={150}
            y2={250}
            color={Colors.GREEN}
            strokeWidth={5}
            duration={1}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Fast line with round caps */}
        <div>
          <h3 style={{ color: 'white' }}>Fast Line (Round Caps)</h3>
          <Line
            x1={75}
            y1={100}
            x2={225}
            y2={200}
            color={Colors.YELLOW}
            strokeWidth={8}
            lineCap="round"
            duration={0.8}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Line with square caps */}
        <div>
          <h3 style={{ color: 'white' }}>Square Caps</h3>
          <Line
            x1={75}
            y1={200}
            x2={225}
            y2={100}
            color={Colors.PURPLE}
            strokeWidth={8}
            lineCap="square"
            duration={2}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Static line */}
        <div>
          <h3 style={{ color: 'white' }}>Static Line</h3>
          <Line
            x1={100}
            y1={100}
            x2={200}
            y2={200}
            color={Colors.WHITE}
            strokeWidth={3}
            width={300}
            height={300}
            animated={false}
          />
        </div>

      </div>

      {/* Combined demo with Circle and Line */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: 'white' }}>Combined Demo: Circle + Lines</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ position: 'relative' }}>
            <h4 style={{ color: 'white', textAlign: 'center' }}>Circle with Cross</h4>
            <div style={{ position: 'relative', width: '300px', height: '300px' }}>
              {/* Circle */}
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                <Circle
                  x={150}
                  y={150}
                  radius={80}
                  color={Colors.BLUE}
                  strokeWidth={3}
                  duration={2}
                  width={300}
                  height={300}
                  animated={true}
                />
              </div>
              {/* Horizontal line */}
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                <Line
                  x1={70}
                  y1={150}
                  x2={230}
                  y2={150}
                  color={Colors.RED}
                  strokeWidth={2}
                  duration={1}
                  start={60} // Start after circle begins
                  width={300}
                  height={300}
                  animated={true}
                />
              </div>
              {/* Vertical line */}
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                <Line
                  x1={150}
                  y1={70}
                  x2={150}
                  y2={230}
                  color={Colors.RED}
                  strokeWidth={2}
                  duration={1}
                  start={90} // Start after horizontal line begins
                  width={300}
                  height={300}
                  animated={true}
                />
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <h4 style={{ color: 'white', textAlign: 'center' }}>Star Pattern</h4>
            <div style={{ position: 'relative', width: '300px', height: '300px' }}>
              {/* Center circle */}
              <div style={{ position: 'absolute', top: 0, left: 0 }}>
                <Circle
                  x={150}
                  y={150}
                  radius={20}
                  color={Colors.YELLOW}
                  fillColor={Colors.YELLOW}
                  strokeWidth={2}
                  duration={1}
                  width={300}
                  height={300}
                  animated={true}
                />
              </div>
              {/* Radiating lines */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
                const rad = (angle * Math.PI) / 180;
                const x2 = 150 + Math.cos(rad) * 100;
                const y2 = 150 + Math.sin(rad) * 100;
                return (
                  <div key={angle} style={{ position: 'absolute', top: 0, left: 0 }}>
                    <Line
                      x1={150}
                      y1={150}
                      x2={x2}
                      y2={y2}
                      color={Colors.ORANGE}
                      strokeWidth={2}
                      duration={0.8}
                      start={30 + index * 10}
                      width={300}
                      height={300}
                      animated={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
      
      <div style={{ marginTop: '40px', color: 'white' }}>
        <h2>Line Component Features:</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>Animated Drawing:</strong> Lines draw from start to end point</li>
          <li><strong>Line Caps:</strong> Support for 'round', 'square', and 'butt' line caps</li>
          <li><strong>Customizable:</strong> Color, stroke width, duration, timing</li>
          <li><strong>Shared Architecture:</strong> Uses same base classes as Circle component</li>
          <li><strong>Timing Control:</strong> Start/end frame control for sequenced animations</li>
          <li><strong>Mathematical Utils:</strong> Automatic length calculation and progress tracking</li>
        </ul>
        
        <h2>Usage Example:</h2>
        <pre style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '15px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
{`import { Line, Circle, Colors } from 'manimjs';

// Basic line
<Line
  x1={50} y1={50}
  x2={250} y2={250}
  color={Colors.CYAN}
  strokeWidth={4}
  duration={2}
  animated={true}
/>

// Combining components
<div style={{ position: 'relative' }}>
  <Circle x={150} y={150} radius={80} color={Colors.BLUE} />
  <Line x1={70} y1={150} x2={230} y2={150} 
        color={Colors.RED} start={60} />
</div>`}
        </pre>
      </div>
    </div>
  );
};

export default LineDemo;