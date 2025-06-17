import { DrawableBase } from '../../core/drawable';
import { DeceleratingTimer, frames } from '../../utils/timer';
import type { CanvasContext, BaseDrawableProps } from '../../core/types';
import { parseColor } from '../../utils/colors';

export interface PieProps extends BaseDrawableProps {
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  fillColor?: string;
  timingFunction?: string;
}

/**
 * Pie/Arc class that Circle extends from
 * Replicates the Pie functionality from original Manim.js
 */
export class Pie extends DrawableBase {
  protected radius: number;
  protected startAngle: number;
  protected endAngle: number;
  protected timer: DeceleratingTimer;
  protected fillColor?: string;

  constructor(canvasContext: CanvasContext, props: PieProps = {}) {
    super(canvasContext, props);
    
    this.radius = props.radius || 50;
    this.startAngle = props.startAngle || 0;
    this.endAngle = props.endAngle || Math.PI * 2;
    this.fillColor = props.fillColor;
    
    this.timer = new DeceleratingTimer(frames(this.duration));
  }

  /**
   * Setup drawing context before rendering
   */
  protected showSetup(): void {
    super.showSetup();
    
    // Set fill style if provided
    if (this.fillColor) {
      this.ctx.fillStyle = parseColor(this.fillColor);
    }
  }

  /**
   * Draw the pie/arc
   */
  show(): void {
    if (this.shouldRender()) {
      this.showSetup();
      
      const progress = this.timer.advance();
      const currentEndAngle = this.startAngle + (this.endAngle - this.startAngle) * progress;
      
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, this.startAngle, currentEndAngle);
      
      if (this.fillColor) {
        this.ctx.fill();
      }
      this.ctx.stroke();
    }
  }

  /**
   * Check if animation is complete
   */
  isAnimationComplete(): boolean {
    return this.timer.isComplete();
  }
}
