import type { CanvasContext, BaseDrawableProps } from '../core/types';
import { LinearTimer } from '../utils/timer';
import type { AnimationTimer } from '../core/types';
import type { PathMorphable } from './pathMorph';

/**
 * Base class for all drawable objects
 * Replicates the PointBase functionality from original Manim.js
 */
export class DrawableBase implements PathMorphable {
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

  // Shake and jump properties
  protected isShaking: boolean = false;
  protected isJumping: boolean = false;
  protected shakeAmplitude: number = 0;
  protected jumpAmplitude: number = 0;
  protected shakeTimer?: AnimationTimer;
  protected jumpTimer?: AnimationTimer;

  // Path morphing properties
  private morphingPath?: string;
  private isMorphing: boolean = false;

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
   * Shake vertically as emphasis
   */
  shake(amplitude: number, duration: number = 1): void {
    this.shakeAmplitude = amplitude;
    this.shakeTimer = new LinearTimer(Math.round(60 * duration)); // assuming 60fps
    this.isShaking = true;
  }

  /**
   * Jump vertically as emphasis
   */
  jump(amplitude: number, duration: number = 1): void {
    this.jumpAmplitude = amplitude;
    this.jumpTimer = new LinearTimer(Math.round(60 * duration)); // assuming 60fps
    this.isJumping = true;
  }

  /**
   * Apply shake effect to position
   */
  protected applyShakeEffect(): void {
    if (this.isShaking && this.shakeTimer) {
      if (!this.shakeTimer.isComplete()) {
        const shakeOffset = Math.sin(this.canvasContext.frameCount * 0.5) * this.shakeAmplitude;
        this.y += shakeOffset;
        this.shakeTimer.advance();
      } else {
        this.isShaking = false;
      }
    }
  }

  /**
   * Apply jump effect to position
   */
  protected applyJumpEffect(): void {
    if (this.isJumping && this.jumpTimer) {
      if (!this.jumpTimer.isComplete()) {
        const progress = this.jumpTimer.advance();
        const jumpOffset = Math.sin(progress * Math.PI) * this.jumpAmplitude;
        this.y -= jumpOffset; // Negative for upward movement
      } else {
        this.isJumping = false;
      }
    }
  }

  /**
   * Should be called before rendering to update movement and setup context
   */
  protected showSetup(): void {
    this.updateMovement();
    this.applyShakeEffect();
    this.applyJumpEffect();
    
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

  /**
   * Default implementation of getPath - should be overridden by subclasses
   */
  getPath(): string {
    // Default implementation returns a small circle at the object's position
    const radius = 1;
    return `M ${this.x + radius},${this.y} A ${radius},${radius} 0 1,1 ${this.x - radius},${this.y} A ${radius},${radius} 0 1,1 ${this.x + radius},${this.y} Z`;
  }

  /**
   * Render from an SVG path during morphing
   */
  renderFromPath(pathString: string): void {
    this.morphingPath = pathString;
    this.isMorphing = true;
    this.renderMorphedPath();
  }

  /**
   * Render the morphed path to canvas
   */
  protected renderMorphedPath(): void {
    if (!this.morphingPath) return;

    this.ctx.save();
    
    try {
      const path2D = new Path2D(this.morphingPath);
      
      // Apply styling
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.strokeWidth;
      
      // Fill and stroke the path
      this.ctx.fill(path2D);
      this.ctx.stroke(path2D);
    } catch (error) {
      console.warn('Failed to render morphed path:', error);
    } finally {
      this.ctx.restore();
    }
  }

  /**
   * Check if currently morphing
   */
  protected isMorphingActive(): boolean {
    return this.isMorphing;
  }

  /**
   * Clear morphing state
   */
  clearMorphing(): void {
    this.isMorphing = false;
    this.morphingPath = undefined;
  }
}
