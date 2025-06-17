import type { CanvasContext, BaseDrawableProps } from '../core/types';
import { LinearTimer } from '../utils/timer';
import type { AnimationTimer } from '../core/types';

/**
 * Base class for all drawable objects
 * Replicates the PointBase functionality from original Manim.js
 */
export class DrawableBase {
  protected ctx: CanvasRenderingContext2D;
  protected canvasContext: CanvasContext;
  public x: number;
  public y: number;
  public start: number;
  public duration: number;
  public end: number;
  public color: string;
  public strokeWidth: number;

  // Movement properties
  protected moved: boolean = false;
  protected xo: number = 0; // original x
  protected xd: number = 0; // destination x
  protected yo: number = 0; // original y
  protected yd: number = 0; // destination y
  protected moveTimer?: AnimationTimer;
  protected moveDuration: number = 0;
  protected moveF: number = 0;

  constructor(canvasContext: CanvasContext, props: BaseDrawableProps = {}) {
    this.canvasContext = canvasContext;
    this.ctx = canvasContext.ctx;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.start = Math.floor(props.start || 30);
    this.duration = props.duration || 1;
    this.end = Math.floor(props.end || 100000);
    this.color = props.color || '#ffffff';
    this.strokeWidth = props.strokeWidth || 3;
  }

  /**
   * Move to a new position with animation
   */
  move(x: number, y: number, duration: number = 1): void {
    this.xo = this.x;
    this.xd = x;
    this.yo = this.y;
    this.yd = y;
    this.moved = true;
    this.moveDuration = Math.round(60 * duration); // assuming 60fps
    this.moveF = 0;
    this.moveTimer = new LinearTimer(this.moveDuration);
  }

  /**
   * Shift by relative amount
   */
  shift(deltaX: number, deltaY: number, duration: number = 1): void {
    this.move(this.x + deltaX, this.y + deltaY, duration);
  }

  /**
   * Update movement animation
   */
  protected updateMovement(): void {
    if (this.moved && this.moveTimer && !this.moveTimer.isComplete()) {
      const t = this.moveTimer.advance();
      this.x = this.xo + t * (this.xd - this.xo);
      this.y = this.yo + t * (this.yd - this.yo);
    } else if (this.moved) {
      this.moved = false;
      this.x = this.xd;
      this.y = this.yd;
    }
  }

  /**
   * Should be called before rendering to update movement and setup context
   */
  protected showSetup(): void {
    this.updateMovement();
    
    // Set basic drawing properties
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.strokeWidth;
  }

  /**
   * Abstract method that should be implemented by subclasses
   */
  show(): void {
    throw new Error('show() method must be implemented by subclass');
  }

  /**
   * Check if the drawable should be rendered based on frame count
   */
  protected shouldRender(): boolean {
    return this.canvasContext.frameCount > this.start;
  }

  /**
   * Update the canvas context (useful when canvas context changes)
   */
  updateCanvasContext(canvasContext: CanvasContext): void {
    this.canvasContext = canvasContext;
    this.ctx = canvasContext.ctx;
  }

  /**
   * Public method to update canvas context (for external use)
   */
  setCanvasContext(canvasContext: CanvasContext): void {
    this.updateCanvasContext(canvasContext);
  }
}
