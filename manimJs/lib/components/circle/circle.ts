import { Pie, type PieProps } from './pie';
import type { CanvasContext } from '../../core/types';
import { PathUtils } from '../../core/pathMorph';

export interface CircleDrawableProps extends Omit<PieProps, 'startAngle' | 'endAngle'> {
  // Circle-specific props can be added here
}

/**
 * Circle class - draws a complete circle with animation
 * Replicates the Circle functionality from original Manim.js
 */
export class CircleDrawable extends Pie {
  private isSceneMode: boolean = false;
  public morphToSquare?: {
    progress: number;
    targetSize: number;
    originalRadius: number;
  };

  constructor(canvasContext: CanvasContext, props: CircleDrawableProps = {}) {
    // Force full circle (0 to 2π)
    super(canvasContext, {
      ...props,
      startAngle: 0,
      endAngle: Math.PI * 2
    });
    
    // Check if this is scene mode (start = 0 usually indicates scene context)
    this.isSceneMode = props.start === 0;
  }

  /**
   * Generate SVG path representation of the circle
   */
  getPath(): string {
    return PathUtils.circle(this.x, this.y, this.radius);
  }

  /**
   * Draw the circle with clockwise animation
   */
  show(): void {
    if (this.shouldRender()) {
      this.showSetup();
      
      // Check if we're morphing using the new path system
      if (this.isMorphingActive()) {
        // Path morphing handles rendering
        return;
      }
      
      if (this.morphToSquare) {
        this.drawMorphedToSquare();
      } else {
        this.drawNormalCircle();
      }
    }
  }

  private drawNormalCircle(): void {
    let currentEndAngle;
    
    if (this.isSceneMode) {
      // In scene mode, show the full circle immediately
      currentEndAngle = Math.PI * 2;
    } else {
      // In regular mode, use animation
      const progress = this.timer.advance();
      currentEndAngle = Math.PI * 2 * progress;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, currentEndAngle);
    
    if (this.fillColor) {
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  private drawMorphedToSquare(): void {
    const { progress, targetSize, originalRadius } = this.morphToSquare!;
    
    // Interpolate between circle and square
    const currentRadius = originalRadius * (1 - progress);
    const currentSquareSize = targetSize * progress;
    
    // Draw morphed shape - start as circle, gradually become more square-like
    if (progress < 0.5) {
      // First half: circle becoming rounded rectangle
      const cornerRadius = currentRadius * (1 - progress * 2);
      this.drawRoundedRect(this.x, this.y, currentRadius * 2, currentRadius * 2, cornerRadius);
    } else {
      // Second half: rounded rectangle becoming square
      const sideLength = originalRadius * 2 + (targetSize - originalRadius * 2) * (progress - 0.5) * 2;
      const cornerRadius = currentRadius * Math.max(0, 1 - (progress - 0.5) * 4);
      this.drawRoundedRect(this.x, this.y, sideLength, sideLength, cornerRadius);
    }
    
    if (this.fillColor) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  private drawRoundedRect(centerX: number, centerY: number, width: number, height: number, radius: number): void {
    const x = centerX - width / 2;
    const y = centerY - height / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  /**
   * Enable scene mode for immediate full rendering
   */
  setSceneMode(enabled: boolean): void {
    this.isSceneMode = enabled;
  }

  // Getters and setters for morphing
  getRadius(): number {
    return this.radius;
  }

  setRadius(radius: number): void {
    this.radius = radius;
  }

  getFillColor(): string | undefined {
    return this.fillColor;
  }

  setFillColor(color: string | undefined): void {
    this.fillColor = color;
  }
}
