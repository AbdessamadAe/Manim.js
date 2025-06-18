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

export { Text, TextFade, TextWriteIn, TextRoll, TextBase } from './components/text';
export type { TextProps, TextFadeProps, TextWriteInProps, TextRollProps } from './components/text';

// Scene-based components
export { 
  Scene, 
  Transition, 
  Circle, 
  Square, 
  Line, 
  Text as SceneText,
  TextFade as SceneTextFade,
  TextWriteIn as SceneTextWriteIn,
  TextRoll as SceneTextRoll
} from './components/scene'; 
  Circle as SceneCircle, 
  Square as SceneSquare, 
  Line as SceneLine,
  SceneElement 
} from './components/scene';
export type { SceneProps, TransitionProps, SceneElementProps } from './components/scene';