import type { AnimationTimer } from '../core/types';

/**
 * Base timer class for animations
 */
export class Timer implements AnimationTimer {
  protected t: number = 0;
  protected f: number = 0;
  protected frames: number;

  constructor(frames: number) {
    this.frames = frames;
  }

  advance(): number {
    if (this.f >= this.frames) return 1;
    this.f++;
    return this.t;
  }

  isComplete(): boolean {
    return this.f >= this.frames;
  }

  reset(): void {
    this.t = 0;
    this.f = 0;
  }
}

/**
 * Timer with deceleration (easing out)
 * Replicates the Timer1 behavior from original Manim.js
 */
export class DeceleratingTimer extends Timer {
  private v: number;
  private a: number;
  private initialV: number;
  private initialA: number;

  constructor(frames: number) {
    super(frames);
    this.a = -2 / (frames * frames);
    this.initialA = this.a;
    // Adjust initial velocity to end exactly at t=1
    this.v = 2 / frames - 1 / (frames * frames);
    this.initialV = this.v;
  }

  advance(): number {
    if (this.f >= this.frames) return 1;

    if (this.v > 0) {
      this.t += this.v;
      this.v += this.a;
    }
    this.f++;
    return Math.min(this.t, 1); // Ensure we don't exceed 1
  }

  reset(): void {
    super.reset();
    this.v = this.initialV;
    this.a = this.initialA;
  }
}

/**
 * Linear timer (constant speed)
 */
export class LinearTimer extends Timer {
  advance(): number {
    if (this.f >= this.frames) return 1;
    this.f++;
    this.t = this.f / this.frames;
    return this.t;
  }
}

/**
 * Timer with acceleration then deceleration (ease-in-out)
 */
export class EaseInOutTimer extends Timer {
  advance(): number {
    if (this.f >= this.frames) return 1;
    this.f++;
    const t = this.f / this.frames;
    // Smooth step function for ease-in-out
    this.t = t * t * (3 - 2 * t);
    return this.t;
  }
}

/**
 * Timer with acceleration (ease-in)
 */
export class AcceleratingTimer extends Timer {
  advance(): number {
    if (this.f >= this.frames) return 1;
    this.f++;
    const t = this.f / this.frames;
    this.t = t * t;
    return this.t;
  }
}

/**
 * Factory function to create timers based on timing function
 */
export function createTimer(frames: number, timingFunction: string = 'decelerate'): AnimationTimer {
  switch (timingFunction) {
    case 'linear':
      return new LinearTimer(frames);
    case 'decelerate':
      return new DeceleratingTimer(frames);
    case 'accelerate':
      return new AcceleratingTimer(frames);
    case 'ease-in-out':
      return new EaseInOutTimer(frames);
    default:
      return new DeceleratingTimer(frames);
  }
}

/**
 * Utility function to convert seconds to frames (assuming 60fps)
 */
export function frames(seconds: number, frameRate: number = 60): number {
  return Math.round(frameRate * seconds);
}
