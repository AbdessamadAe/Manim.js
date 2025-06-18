import React, { useEffect, useRef } from 'react';
import { Text, TextFade, TextWriteIn, TextRoll } from '../lib/components/text';

const TextDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 675;

    let frameCount = 0;
    const canvasContext = { ctx, frameCount };

    // Create different text objects
    const basicText = new Text(canvasContext, {
      text: 'Basic Text',
      x: 100,
      y: 100,
      fontSize: 40,
      color: '#ffffff',
      start: 0
    });

    const centeredText = new Text(canvasContext, {
      text: 'Centered Text',
      x: 600,
      y: 200,
      fontSize: 50,
      color: '#00ff00',
      mode: 1, // center mode
      start: 0
    });

    const fadeText = new TextFade(canvasContext, {
      text: 'Fade In Text',
      x: 100,
      y: 300,
      fontSize: 45,
      color: '#ff6b6b',
      start: 60,
      fadeInDuration: 2
    });

    const writeInText = new TextWriteIn(canvasContext, {
      text: 'This text writes in character by character!',
      x: 100,
      y: 400,
      fontSize: 35,
      color: '#4ecdc4',
      start: 120,
      writeSpeed: 5
    });

    const rollText = new TextRoll(canvasContext, {
      text: '0',
      x: 100,
      y: 500,
      fontSize: 60,
      color: '#ffe66d',
      targetValue: 100,
      start: 180,
      rollDuration: 3,
      rollStyle: 'increment'
    });

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update frame count
      canvasContext.frameCount = frameCount;

      // Show all text objects
      basicText.show();
      centeredText.show();
      fadeText.show();
      writeInText.show();
      rollText.show();

      // Add some interactive animations
      if (frameCount === 240) {
        basicText.move(300, 150, 2);
        basicText.shake(5, 1);
      }

      if (frameCount === 300) {
        centeredText.reColor('#ff9999', 1);
        centeredText.jump(20, 1.5);
      }

      if (frameCount === 360) {
        fadeText.fadeOut();
      }

      if (frameCount === 420) {
        rollText.roll(999, 2);
      }

      frameCount++;
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      frameCount = 999999; // Stop animation
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>
        Manim.js Text Component Demo
      </h1>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      />
      <div style={{ 
        marginTop: '20px', 
        color: '#ccc', 
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h3>Features Demonstrated:</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li><strong>Basic Text:</strong> Simple text rendering with different alignment modes</li>
          <li><strong>Text Fade:</strong> Smooth fade-in and fade-out animations</li>
          <li><strong>Text Write-In:</strong> Character-by-character typing animation</li>
          <li><strong>Text Roll:</strong> Number rolling and value change animations</li>
          <li><strong>Animations:</strong> Move, shake, jump, and color change effects</li>
        </ul>
      </div>
    </div>
  );
};

export default TextDemo;
