export interface AnimationTimer {
  advance(): number;
  isComplete(): boolean;
}

export interface CanvasContext {
  ctx: CanvasRenderingContext2D;
  frameCount: number;
}

export interface BaseDrawableProps {
  x?: number;
  y?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  start?: number;
  end?: number;
  animated?: boolean;
  onAnimationComplete?: () => void;
}

export interface AnimationOptions {
  duration?: number;
  start?: number;
  end?: number;
  timingFunction?: 'linear' | 'decelerate' | 'accelerate' | 'ease-in-out';
}

export type EasingFunction = (t: number) => number;
