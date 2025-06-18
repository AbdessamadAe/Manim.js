import type { BaseDrawableProps } from '../../core/types';

export interface SceneProps {
  width: number;
  height: number;
  duration: number;
  children: React.ReactNode;
}

export interface TransitionProps {
  from: string;
  to: string;
  start: number;
  duration: number;
  type: 'morph' | 'fade' | 'move' | 'scale';
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

export interface SceneElement {
  id?: string;
  type: string;
  props: any;
  drawable?: any;
}

export interface SceneContext {
  elements: Map<string, SceneElement>;
  transitions: TransitionProps[];
  frameCount: number;
  canvasContext: CanvasRenderingContext2D;
  registerElement: (id: string, element: SceneElement) => void;
  getElement: (id: string) => SceneElement | undefined;
}

// Generic props for any scene element that needs an id
export interface SceneElementProps extends BaseDrawableProps {
  id?: string;
}
