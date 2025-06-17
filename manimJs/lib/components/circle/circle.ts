import { Pie, type PieProps } from './pie';
import type { CanvasContext } from '../../core/types';

export interface CircleDrawableProps extends Omit<PieProps, 'startAngle' | 'endAngle'> {
  // Circle-specific props can be added here
}

/**
 * Circle class - draws a complete circle with animation
 * Replicates the Circle functionality from original Manim.js
 */
export class CircleDrawable extends Pie {
  constructor(canvasContext: CanvasContext, props: CircleDrawableProps = {}) {
    // Force full circle (0 to 2π)
    super(canvasContext, {
      ...props,
      startAngle: 0,
      endAngle: Math.PI * 2
    });
  }

  /**
   * Draw the circle with clockwise animation
   */
  show(): void {
    if (this.shouldRender()) {
      this.showSetup();
      
      const progress = this.timer.advance();
      // Draw from 0 to progress * 2π (clockwise)
      const currentEndAngle = Math.PI * 2 * progress;
      
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, currentEndAngle);
      
      if (this.fillColor) {
        this.ctx.fill();
      }
      this.ctx.stroke();
    }
  }
}
