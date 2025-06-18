import type { CanvasContext } from '../../core/types';
import { DrawableBase } from '../../core/drawable';
import type { SquareProps } from './types';
import { PathUtils } from '../../core/pathMorph';

export class SquareDrawable extends DrawableBase {
  private size: number;
  private fillColor?: string;
  public morphToCircle?: {
    progress: number;
    targetRadius: number;
    originalSize: number;
  };

  constructor(canvasContext: CanvasContext, props: SquareProps = {}) {
    super(canvasContext, props);
    this.size = props.size || 50;
    this.fillColor = props.fillColor;
  }

  /**
   * Generate SVG path representation of the square
   */
  getPath(): string {
    return PathUtils.square(this.x, this.y, this.size);
  }

  show(): void {
    if (!this.shouldRender()) return;
    
    this.showSetup();
    
    // Check if we're morphing using the new path system
    if (this.isMorphingActive()) {
      // Path morphing handles rendering
      return;
    }
    
    if (this.morphToCircle) {
      this.drawMorphedToCircle();
    } else {
      this.drawNormalSquare();
    }
  }

  private drawNormalSquare(): void {
    const halfSize = this.size / 2;
    
    // Draw square
    this.ctx.beginPath();
    this.ctx.rect(this.x - halfSize, this.y - halfSize, this.size, this.size);
    
    if (this.fillColor) {
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
    }
    
    this.ctx.stroke();
  }

  private drawMorphedToCircle(): void {
    const { progress, targetRadius, originalSize } = this.morphToCircle!;
    
    if (progress < 0.5) {
      // First half: square becoming rounded rectangle
      const cornerRadius = (originalSize / 4) * progress * 2;
      this.drawRoundedRect(this.x, this.y, originalSize, originalSize, cornerRadius);
    } else {
      // Second half: rounded rectangle becoming circle
      const currentSize = originalSize + (targetRadius * 2 - originalSize) * (progress - 0.5) * 2;
      const cornerRadius = Math.min(currentSize / 2, targetRadius);
      this.drawRoundedRect(this.x, this.y, currentSize, currentSize, cornerRadius);
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

  // Getters for morphing
  getSize(): number {
    return this.size;
  }

  setSize(size: number): void {
    this.size = size;
  }

  getFillColor(): string | undefined {
    return this.fillColor;
  }

  setFillColor(color: string | undefined): void {
    this.fillColor = color;
  }
}
