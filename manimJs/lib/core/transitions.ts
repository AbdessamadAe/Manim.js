import type { SceneElement, TransitionProps } from '../components/scene/types';
import { getEasingFunction } from '../utils/easing';
import { CircleDrawable } from '../components/circle/circle';
import { SquareDrawable } from '../components/square/square';
import { LineDrawable } from '../components/line/line';
import { PathMorphEngine, type PathMorphable } from './pathMorph';

export interface TransitionState {
  isActive: boolean;
  progress: number;
  startFrame: number;
  endFrame: number;
}

export class TransitionManager {
  private transitions: Map<string, TransitionProps> = new Map();
  private transitionStates: Map<string, TransitionState> = new Map();
  private originalStates: Map<string, any> = new Map(); // Store original states
  private frameRate: number = 60; // frames per second
  private morphEngine: PathMorphEngine;
  private activeInterpolators: Map<string, (t: number) => string> = new Map();
  private completedMorphs: Set<string> = new Set(); // Track completed morph transitions

  constructor(frameRate: number = 60) {
    this.frameRate = frameRate;
    this.morphEngine = PathMorphEngine.getInstance();
  }

  addTransition(id: string, transition: TransitionProps): void {
    this.transitions.set(id, transition);
    this.transitionStates.set(id, {
      isActive: false,
      progress: 0,
      startFrame: Math.floor(transition.start * this.frameRate),
      endFrame: Math.floor((transition.start + transition.duration) * this.frameRate)
    });
  }

  updateTransitions(frameCount: number, elements: Map<string, SceneElement>): void {
    for (const [id, transition] of this.transitions) {
      const state = this.transitionStates.get(id);
      if (!state) continue;

      const fromElement = elements.get(transition.from);
      const toElement = elements.get(transition.to);
      
      if (!fromElement || !toElement) continue;

      // For morph transitions, manage visibility based on transition state
      if (transition.type === 'morph') {
        if (this.completedMorphs.has(id)) {
          // Transition is completed - keep from hidden, to visible
          fromElement.props.visible = false;
          toElement.props.visible = true;
          continue; // Skip further processing for completed transitions
        } else if (frameCount < state.endFrame) {
          // Transition hasn't completed - hide target until it does
          toElement.props.visible = false;
        }
      }

      // Check if transition should be active
      if (frameCount >= state.startFrame && frameCount <= state.endFrame) {
        if (!state.isActive) {
          // Store original states when transition starts
          this.storeOriginalStates(id, fromElement, toElement);
          state.isActive = true;
        }
        
        const rawProgress = (frameCount - state.startFrame) / (state.endFrame - state.startFrame);
        const easingFn = getEasingFunction(transition.easing || 'linear');
        state.progress = easingFn(Math.max(0, Math.min(1, rawProgress)));

        this.applyTransition(id, transition, state, fromElement, toElement);
      } else if (frameCount > state.endFrame && state.isActive) {
        // Transition complete
        state.isActive = false;
        state.progress = 1;
        this.completeTransition(id, transition, fromElement, toElement);
      }
    }
  }

  private storeOriginalStates(transitionId: string, fromElement: SceneElement, toElement: SceneElement): void {
    const fromDrawable = fromElement.drawable;
    const toDrawable = toElement.drawable;
    
    if (!fromDrawable || !toDrawable) return;
    
    this.originalStates.set(transitionId, {
      from: {
        x: fromDrawable.x,
        y: fromDrawable.y,
        radius: fromDrawable.getRadius?.() || null,
        size: fromDrawable.getSize?.() || null,
        color: fromDrawable.color,
        fillColor: fromDrawable.getFillColor?.() || null
      },
      to: {
        x: toDrawable.x,
        y: toDrawable.y,
        radius: toDrawable.getRadius?.() || null,
        size: toDrawable.getSize?.() || null,
        color: toDrawable.color,
        fillColor: toDrawable.getFillColor?.() || null
      }
    });
  }

  private applyTransition(
    transitionId: string,
    transition: TransitionProps,
    state: TransitionState,
    fromElement: SceneElement,
    toElement: SceneElement
  ): void {
    const { type } = transition;
    const { progress } = state;

    switch (type) {
      case 'morph':
        this.applyMorphTransition(transitionId, progress, fromElement, toElement);
        break;
      case 'fade':
        this.applyFadeTransition(progress, fromElement, toElement);
        break;
      case 'move':
        this.applyMoveTransition(progress, fromElement, toElement);
        break;
      case 'scale':
        this.applyScaleTransition(progress, fromElement, toElement);
        break;
    }
  }

  private applyMorphTransition(transitionId: string, progress: number, fromElement: SceneElement, toElement: SceneElement): void {
    const fromDrawable = fromElement.drawable;
    const toDrawable = toElement.drawable;
    const originalStates = this.originalStates.get(transitionId);

    if (!fromDrawable || !toDrawable || !originalStates) return;

    // Interpolate position
    fromDrawable.x = originalStates.from.x + (originalStates.to.x - originalStates.from.x) * progress;
    fromDrawable.y = originalStates.from.y + (originalStates.to.y - originalStates.from.y) * progress;

    // Check if both drawables support path morphing
    if (this.isPathMorphable(fromDrawable) && this.isPathMorphable(toDrawable)) {
      this.applyPathMorph(transitionId, progress, fromDrawable, toDrawable);
    }

    // Interpolate colors
    this.interpolateColors(progress, fromDrawable, originalStates);
  }

  private isPathMorphable(drawable: any): drawable is PathMorphable {
    return drawable && typeof drawable.getPath === 'function' && typeof drawable.renderFromPath === 'function';
  }

  private applyPathMorph(transitionId: string, progress: number, fromDrawable: PathMorphable, toDrawable: PathMorphable): void {
    // Get or create interpolator for this transition
    let interpolator = this.activeInterpolators.get(transitionId);
    if (!interpolator) {
      interpolator = this.morphEngine.getInterpolator(fromDrawable, toDrawable);
      this.activeInterpolators.set(transitionId, interpolator);
    }

    // Generate the interpolated path
    const morphedPath = interpolator(progress);
    
    // Render the morphed shape
    fromDrawable.renderFromPath(morphedPath);
  }

  private interpolateColors(progress: number, drawable: any, originalStates: any): void {
    const fromColor = originalStates.from.fillColor || originalStates.from.color;
    const toColor = originalStates.to.fillColor || originalStates.to.color;
    
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      if (drawable.setFillColor && typeof drawable.setFillColor === 'function') {
        drawable.setFillColor(interpolatedColor);
      } else if (drawable.color !== undefined) {
        drawable.color = interpolatedColor;
      }
    }
  }

  private morphCircleToSquare(progress: number, circle: CircleDrawable, originalStates: any): void {
    const fromRadius = originalStates.from.radius;
    const toSize = originalStates.to.size;
    
    // Gradually transform the circle into a square-like shape
    // We'll use a custom rendering approach for smooth morphing
    circle.morphToSquare = {
      progress,
      targetSize: toSize,
      originalRadius: fromRadius
    };
    
    // Interpolate colors
    const fromColor = originalStates.from.fillColor || originalStates.from.color;
    const toColor = originalStates.to.fillColor || originalStates.to.color;
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      circle.setFillColor(interpolatedColor);
    }
  }

  private morphSquareToCircle(progress: number, square: SquareDrawable, originalStates: any): void {
    const fromSize = originalStates.from.size;
    const toRadius = originalStates.to.radius;
    
    // Transform square into circle-like shape
    square.morphToCircle = {
      progress,
      targetRadius: toRadius,
      originalSize: fromSize
    };
    
    // Interpolate colors
    const fromColor = originalStates.from.fillColor || originalStates.from.color;
    const toColor = originalStates.to.fillColor || originalStates.to.color;
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      square.setFillColor(interpolatedColor);
    }
  }

  private morphLineToCircle(progress: number, line: LineDrawable, circle: CircleDrawable): void {
    // Transform line into circle-like shape
    const lineLength = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    const targetRadius = circle.getRadius();
    
    // Move line center towards circle center
    const lineCenterX = (line.x1 + line.x2) / 2;
    const lineCenterY = (line.y1 + line.y2) / 2;
    
    const newCenterX = lineCenterX + (circle.x - lineCenterX) * progress;
    const newCenterY = lineCenterY + (circle.y - lineCenterY) * progress;
    
    // Gradually make the line shorter and more circular
    const currentLength = lineLength * (1 - progress * 0.8);
    line.x1 = newCenterX - currentLength / 2;
    line.y1 = newCenterY;
    line.x2 = newCenterX + currentLength / 2;
    line.y2 = newCenterY;
    
    // Interpolate colors
    const fromColor = line.color;
    const toColor = circle.getFillColor() || circle.color;
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      line.color = interpolatedColor;
    }
  }

  private morphCircleToLine(progress: number, circle: CircleDrawable, line: LineDrawable): void {
    // Transform circle into line-like shape
    const targetLength = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    
    // Gradually reduce circle radius and elongate it
    const originalRadius = circle.getRadius();
    const newRadius = originalRadius * (1 - progress * 0.8);
    circle.setRadius(newRadius);
    
    // Move towards line center
    const lineCenterX = (line.x1 + line.x2) / 2;
    const lineCenterY = (line.y1 + line.y2) / 2;
    
    circle.x = circle.x + (lineCenterX - circle.x) * progress;
    circle.y = circle.y + (lineCenterY - circle.y) * progress;
    
    // Interpolate colors
    const fromColor = circle.getFillColor() || circle.color;
    const toColor = line.color;
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      circle.setFillColor(interpolatedColor);
    }
  }

  private morphLineToSquare(progress: number, line: LineDrawable, square: SquareDrawable): void {
    // Transform line into square-like shape
    const lineLength = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    const targetSize = square.getSize();
    
    // Move line center towards square center
    const lineCenterX = (line.x1 + line.x2) / 2;
    const lineCenterY = (line.y1 + line.y2) / 2;
    
    const newCenterX = lineCenterX + (square.x - lineCenterX) * progress;
    const newCenterY = lineCenterY + (square.y - lineCenterY) * progress;
    
    // Gradually make the line shorter
    const currentLength = lineLength * (1 - progress * 0.7);
    line.x1 = newCenterX - currentLength / 2;
    line.y1 = newCenterY;
    line.x2 = newCenterX + currentLength / 2;
    line.y2 = newCenterY;
    
    // Interpolate colors
    const fromColor = line.color;
    const toColor = square.getFillColor() || square.color;
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      line.color = interpolatedColor;
    }
  }

  private morphSquareToLine(progress: number, square: SquareDrawable, line: LineDrawable): void {
    // Transform square into line-like shape
    const originalSize = square.getSize();
    const targetLength = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    
    // Gradually reduce square size
    const newSize = originalSize * (1 - progress * 0.7);
    square.setSize(newSize);
    
    // Move towards line center
    const lineCenterX = (line.x1 + line.x2) / 2;
    const lineCenterY = (line.y1 + line.y2) / 2;
    
    square.x = square.x + (lineCenterX - square.x) * progress;
    square.y = square.y + (lineCenterY - square.y) * progress;
    
    // Interpolate colors
    const fromColor = square.getFillColor() || square.color;
    const toColor = line.color;
    if (fromColor && toColor) {
      const interpolatedColor = this.interpolateColor(fromColor, toColor, progress);
      square.setFillColor(interpolatedColor);
    }
  }

  private applyFadeTransition(progress: number, fromElement: SceneElement, toElement: SceneElement): void {
    const fromDrawable = fromElement.drawable;
    const toDrawable = toElement.drawable;

    if (fromDrawable) {
      fromDrawable.opacity = 1 - progress;
    }
    if (toDrawable) {
      toDrawable.opacity = progress;
    }
  }

  private applyMoveTransition(progress: number, fromElement: SceneElement, toElement: SceneElement): void {
    const fromDrawable = fromElement.drawable;
    const toDrawable = toElement.drawable;

    if (fromDrawable && toDrawable) {
      const startX = fromElement.props.x || 0;
      const startY = fromElement.props.y || 0;
      const endX = toElement.props.x || 0;
      const endY = toElement.props.y || 0;

      fromDrawable.x = startX + (endX - startX) * progress;
      fromDrawable.y = startY + (endY - startY) * progress;
    }
  }

  private applyScaleTransition(progress: number, fromElement: SceneElement, toElement: SceneElement): void {
    const fromDrawable = fromElement.drawable;
    
    if (fromDrawable) {
      const scale = 1 + progress * 0.5; // Scale up by 50%
      fromDrawable.scale = scale;
    }
  }

  private completeTransition(transitionId: string, transition: TransitionProps, fromElement: SceneElement, toElement: SceneElement): void {
    const fromDrawable = fromElement.drawable;
    const toDrawable = toElement.drawable;
    const originalStates = this.originalStates.get(transitionId);
    
    // Clean up path morph states
    if (fromDrawable && this.isPathMorphable(fromDrawable)) {
      fromDrawable.clearMorphing();
    }
    
    // Clean up legacy morph states
    if (fromDrawable) {
      fromDrawable.morphToSquare = undefined;
      fromDrawable.morphToCircle = undefined;
    }
    
    // Clean up cached interpolator
    this.activeInterpolators.delete(transitionId);
    
    // Make sure the final state is set correctly
    if (transition.type === 'morph') {
      // Ensure the target element is at the final interpolated position
      if (toDrawable && originalStates) {
        toDrawable.x = originalStates.to.x;
        toDrawable.y = originalStates.to.y;
      }
      
      // Hide the original element and show the target
      fromElement.props.visible = false;
      toElement.props.visible = true;
      
      // Force the from element to stay hidden by removing it from rendering
      if (fromDrawable) {
        fromDrawable.clearMorphing();
      }
      
      // Mark this morph as completed to prevent further visibility changes
      this.completedMorphs.add(transitionId);
    }
    
    // Clean up stored states
    this.originalStates.delete(transitionId);
  }

  private interpolateColor(color1: string, color2: string, progress: number): string {
    // Simple color interpolation (works with hex colors)
    // This is a basic implementation - you might want to use a more sophisticated color library
    if (color1.startsWith('#') && color2.startsWith('#')) {
      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);
      
      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Fallback to original colors
    return progress < 0.5 ? color1 : color2;
  }

  /**
   * Reset all transitions and clear completed morph tracking
   */
  reset(): void {
    this.transitions.clear();
    this.transitionStates.clear();
    this.originalStates.clear();
    this.activeInterpolators.clear();
    this.completedMorphs.clear();
    this.morphEngine.clearCache();
  }

  /**
   * Remove a specific transition
   */
  removeTransition(id: string): void {
    this.transitions.delete(id);
    this.transitionStates.delete(id);
    this.originalStates.delete(id);
    this.activeInterpolators.delete(id);
    this.completedMorphs.delete(id);
  }

  /**
   * Get transition statistics for debugging
   */
  getStats(): { 
    activeTransitions: number; 
    completedMorphs: number; 
    cacheStats: any 
  } {
    return {
      activeTransitions: this.transitions.size,
      completedMorphs: this.completedMorphs.size,
      cacheStats: this.morphEngine.getCacheStats()
    };
  }
}
