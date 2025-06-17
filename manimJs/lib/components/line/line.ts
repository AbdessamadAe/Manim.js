import { DrawableBase } from '../../core/drawable';
import { LinearTimer, frames } from '../../utils/timer';
import type { CanvasContext } from '../../core/types';
import type { LineProps } from './types';
import { distance } from '../../utils/math';

/**
 * Line class - draws a line with animation
 * Example of how to use the shared base utilities for other components
 */
export class LineDrawable extends DrawableBase {
  protected x1: number;
  protected y1: number;
  protected x2: number;
  protected y2: number;
  protected lineCap: CanvasLineCap;
  protected timer: LinearTimer;
  protected totalLength: number;

  constructor(canvasContext: CanvasContext, props: LineProps = {}) {
    super(canvasContext, props);
    
    this.x1 = props.x1 || props.x || 0;
    this.y1 = props.y1 || props.y || 0;
    this.x2 = props.x2 || (props.x || 0) + 100;
    this.y2 = props.y2 || props.y || 0;
    this.lineCap = props.lineCap || 'round';
    
    this.totalLength = distance(this.x1, this.y1, this.x2, this.y2);
    this.timer = new LinearTimer(frames(this.duration));
  }

  /**
   * Setup drawing context before rendering
   */
  protected showSetup(): void {
    super.showSetup();
    this.ctx.lineCap = this.lineCap;
  }

  /**
   * Draw the line with animation
   */
  show(): void {
    if (this.shouldRender()) {
      this.showSetup();
      
      const progress = this.timer.advance();
      
      // Calculate current end point based on progress
      const currentX2 = this.x1 + (this.x2 - this.x1) * progress;
      const currentY2 = this.y1 + (this.y2 - this.y1) * progress;
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.x1, this.y1);
      this.ctx.lineTo(currentX2, currentY2);
      this.ctx.stroke();
    }
  }

  /**
   * Check if animation is complete
   */
  isAnimationComplete(): boolean {
    return this.timer.isComplete();
  }

  /**
   * Force complete the animation
   */
  forceComplete(): void {
    this.timer.advance = () => 1;
  }

  /**
   * Get the current length of the animated line
   */
  getCurrentLength(): number {
    const progress = this.timer.isComplete() ? 1 : this.timer.advance();
    return this.totalLength * progress;
  }
}
