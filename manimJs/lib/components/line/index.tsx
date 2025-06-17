import React, { useRef, useEffect, useCallback } from 'react';
import { LineDrawable } from './line';
import type { LineProps } from './types';
import type { BaseDrawableProps } from '../../core/types';

interface ReactLineProps extends LineProps, BaseDrawableProps {
  width?: number; 
  height?: number; 
  className?: string;
}

/**
 * Line React component
 * A React wrapper around the LineDrawable class for easy integration
 */
export const Line: React.FC<ReactLineProps> = ({
  x1 = 50,
  y1 = 150,
  x2 = 250,
  y2 = 150,
  color = '#ffffff',
  strokeWidth = 3,
  lineCap = 'round',
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
  const lineRef = useRef<LineDrawable | null>(null);
  const frameCountRef = useRef(0);
  const animationIdRef = useRef<number>(null);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !lineRef.current) return;

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
    lineRef.current.updateCanvasContext(canvasContext);
    
    // Draw line
    lineRef.current.show();
    
    // Check if animation is complete
    if (lineRef.current.isAnimationComplete() && onAnimationComplete) {
      onAnimationComplete();
    }
    
    // Continue animation if not complete
    if (!lineRef.current.isAnimationComplete()) {
      animationIdRef.current = requestAnimationFrame(animate);
    }
  }, [onAnimationComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create line instance
    const canvasContext = {
      ctx,
      frameCount: frameCountRef.current
    };

    lineRef.current = new LineDrawable(canvasContext, {
      x1,
      y1,
      x2,
      y2,
      color,
      strokeWidth,
      lineCap,
      duration,
      start,
      end
    });

    // Start animation
    if (animated) {
      frameCountRef.current = 0;
      animationIdRef.current = requestAnimationFrame(animate);
    } else {
      // If not animated, draw immediately at full completion
      frameCountRef.current = start + 1;
      lineRef.current.forceComplete(); // Force complete
      lineRef.current.show();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [x1, y1, x2, y2, color, strokeWidth, lineCap, duration, start, end, width, height, animated, animate]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default Line;

// Export drawable classes for advanced usage
export { LineDrawable } from './line';
export * from './types';

// Re-export core utilities that might be useful
export { DrawableBase } from '../../core/drawable';
export type { CanvasContext, BaseDrawableProps } from '../../core/types';
