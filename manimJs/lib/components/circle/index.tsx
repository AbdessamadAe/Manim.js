import React, { useRef, useEffect, useCallback } from 'react';
import { CircleDrawable, type CircleDrawableProps } from './circle';
import type { CircleProps } from './types';
import type { BaseDrawableProps } from '../../core/types';

interface ReactCircleProps extends CircleProps, BaseDrawableProps {
  width?: number; 
  height?: number; 
  className?: string;
}

/**
 * Circle React component
 * A React wrapper around the CircleDrawable class for easy integration
 */
export const Circle: React.FC<ReactCircleProps> = ({
  x = 150,
  y = 150,
  radius = 50,
  color = '#ffffff',
  fillColor,
  strokeWidth = 3,
  duration = 1,
  start = 30,
  end = 100000,
  animated = true,
  onAnimationComplete,
  width = 300,
  height = 300,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circleRef = useRef<CircleDrawable | null>(null);
  const frameCountRef = useRef(0);
  const animationIdRef = useRef<number>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !circleRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update frame count
    frameCountRef.current++;
    
    // Update canvas context
    const canvasContext = {
      ctx,
      frameCount: frameCountRef.current
    };
    circleRef.current.setCanvasContext(canvasContext);
    
    // Draw circle
    circleRef.current.show();
    
    // Check if animation is complete
    if (circleRef.current.isAnimationComplete() && onAnimationComplete) {
      onAnimationComplete();
    }
    
    // Continue animation if not complete or if not animated
    if (!circleRef.current.isAnimationComplete() || !animated) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [animated, onAnimationComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create circle instance
    const canvasContext = {
      ctx,
      frameCount: frameCountRef.current
    };

    circleRef.current = new CircleDrawable(canvasContext, {
      x,
      y,
      radius,
      color,
      fillColor,
      strokeWidth,
      duration,
      start,
      end
    } as CircleDrawableProps);

    // Start animation
    if (animated) {
      frameCountRef.current = 0;
      animationIdRef.current = requestAnimationFrame(animate);
    } else {
      // If not animated, draw immediately at full completion
      frameCountRef.current = start + 1;
      circleRef.current.forceComplete(); // Force complete
      circleRef.current.show();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [x, y, radius, color, fillColor, strokeWidth, duration, start, end, width, height, animated, animate]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default Circle;

// Export drawable classes for advanced usage
export { CircleDrawable } from './circle';
export { Pie } from './pie';
export * from './types';