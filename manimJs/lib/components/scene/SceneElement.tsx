import React, { useEffect } from 'react';
import { useScene } from './Scene';
import { CircleDrawable } from '../circle/circle';
import { SquareDrawable } from '../square/square';
import { LineDrawable } from '../line/line';
import type { SceneElementProps } from './types';
import type { CircleProps } from '../circle/types';
import type { SquareProps } from '../square/types';
import type { LineProps } from '../line/types';

interface GenericSceneElementProps extends SceneElementProps {
  componentType: 'circle' | 'square' | 'line';
  [key: string]: any;
}

export const SceneElement: React.FC<GenericSceneElementProps> = ({ componentType, id, ...props }) => {
  const { registerElement, canvasContext } = useScene();
  
  useEffect(() => {
    if (!canvasContext || !id) {
      return;
    }
    
    let drawable;
    
    switch (componentType) {
      case 'circle':
        drawable = new CircleDrawable(
          { ctx: canvasContext, frameCount: 0 },
          { ...props, start: 0 } as CircleProps
        );
        drawable.setSceneMode(true);
        break;
      case 'square':
        drawable = new SquareDrawable(
          { ctx: canvasContext, frameCount: 0 },
          { ...props, start: 0 } as SquareProps
        );
        break;
      case 'line':
        drawable = new LineDrawable(
          { ctx: canvasContext, frameCount: 0 },
          { ...props, start: 0 } as LineProps
        );
        drawable.setSceneMode(true);
        break;
      default:
        console.warn(`Unknown component type: ${componentType}`);
        return;
    }
    
    const element = {
      id,
      type: componentType,
      props: { ...props, id, visible: true },
      drawable
    };
    
    registerElement(id, element);
    
    // Cleanup function
    return () => {
      // Could remove element from map here if needed
    };
  }, [componentType, id, JSON.stringify(props), canvasContext, registerElement]);
  
  return null;
};

// Specific component wrappers for better developer experience
export const Circle: React.FC<CircleProps & { id?: string }> = (props) => (
  <SceneElement componentType="circle" {...props} />
);

export const Square: React.FC<SquareProps & { id?: string }> = (props) => (
  <SceneElement componentType="square" {...props} />
);

export const Line: React.FC<LineProps & { id?: string }> = (props) => (
  <SceneElement componentType="line" {...props} />
);

