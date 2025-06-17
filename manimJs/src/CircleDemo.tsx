import React from 'react';
import { Circle, Colors } from '../lib/main';

const CircleDemo: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', marginBottom: '20px' }}>ManimJs Circle Components Demo</h1>
      
      <div style={{ marginBottom: '20px', color: 'white' }}>
        <p>This demo showcases the refactored Circle component using the new modular architecture.</p>
        <p>The component now uses shared utilities from <code>core/</code> and <code>utils/</code> directories.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Basic animated circle */}
        <div>
          <h3 style={{ color: 'white' }}>Basic Animated Circle</h3>
          <Circle
            x={150}
            y={150}
            radius={60}
            color={Colors.CYAN}
            duration={2}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Filled circle */}
        <div>
          <h3 style={{ color: 'white' }}>Filled Circle</h3>
          <Circle
            x={150}
            y={150}
            radius={60}
            color={Colors.RED}
            fillColor={Colors.RED + '50'}
            strokeWidth={4}
            duration={1.5}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Fast animation */}
        <div>
          <h3 style={{ color: 'white' }}>Fast Animation</h3>
          <Circle
            x={150}
            y={150}
            radius={60}
            color={Colors.GREEN}
            duration={0.8}
            strokeWidth={5}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Slow animation */}
        <div>
          <h3 style={{ color: 'white' }}>Slow Animation</h3>
          <Circle
            x={150}
            y={150}
            radius={60}
            color={Colors.YELLOW}
            duration={3}
            strokeWidth={2}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Different sizes */}
        <div>
          <h3 style={{ color: 'white' }}>Large Circle</h3>
          <Circle
            x={150}
            y={150}
            radius={80}
            color={Colors.PURPLE}
            strokeWidth={6}
            duration={2}
            width={300}
            height={300}
            animated={true}
          />
        </div>

        {/* Static circle (no animation) */}
        <div>
          <h3 style={{ color: 'white' }}>Static Circle</h3>
          <Circle
            x={150}
            y={150}
            radius={60}
            color={Colors.WHITE}
            strokeWidth={3}
            width={300}
            height={300}
            animated={false}
          />
        </div>

      </div>
      
      <div style={{ marginTop: '40px', color: 'white' }}>
        <h2>New Architecture Benefits:</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>Modular Design:</strong> Base utilities in <code>core/</code> and <code>utils/</code> can be reused by other components</li>
          <li><strong>Type Safety:</strong> Full TypeScript support with proper interfaces</li>
          <li><strong>Extensible:</strong> Easy to create new components using <code>DrawableBase</code></li>
          <li><strong>Animation System:</strong> Multiple timing functions (linear, decelerate, ease-in-out, etc.)</li>
          <li><strong>Color System:</strong> Predefined colors and color utilities</li>
          <li><strong>Math Utilities:</strong> Common mathematical functions for animations</li>
        </ul>
        
        <h2>Usage Example:</h2>
        <pre style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '15px', 
          borderRadius: '8px',
          overflow: 'auto'
        }}>
{`import { Circle, Colors, DrawableBase } from 'manimjs';

// Using predefined colors
<Circle
  x={150}
  y={150}
  radius={60}
  color={Colors.BLUE}
  fillColor={Colors.BLUE + '50'}
  strokeWidth={3}
  duration={2}
  animated={true}
/>

// Creating custom components using shared utilities
class MyComponent extends DrawableBase {
  constructor(canvasContext, props) {
    super(canvasContext, props);
    this.timer = new DeceleratingTimer(frames(this.duration));
  }
  
  show() {
    if (this.shouldRender()) {
      this.showSetup();
      // Your drawing logic here
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default CircleDemo;
