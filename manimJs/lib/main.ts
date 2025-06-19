// Main library exports

// Core functionality
export * from './core';
export * from './utils';

// Components
export { Circle, type CircleDrawable, Pie } from './components/circle';
export type { CircleProps } from './components/circle';

export { Line, LineDrawable } from './components/line';
export type { LineProps } from './components/line';

export { SquareDrawable } from './components/square';
export type { SquareProps } from './components/square';

// Scene-based components
export { 
  Scene, 
  Transition, 
  Circle as SceneCircle,
  Square as SceneSquare,
  Line as SceneLine,
} from './components/scene'; 

export type { SceneProps, TransitionProps, SceneElementProps } from './components/scene';