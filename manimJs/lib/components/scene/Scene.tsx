import React, { createContext, useContext, useState, useRef, useEffect, ReactElement } from 'react';
import type { SceneProps, SceneElement, TransitionProps, SceneContext } from './types';
import { TransitionManager } from '../../core/transitions';

const SceneContextProvider = createContext<SceneContext | null>(null);

export const useScene = () => {
  const context = useContext(SceneContextProvider);
  if (!context) {
    throw new Error('useScene must be used within a Scene component');
  }
  return context;
};

export const Scene: React.FC<SceneProps> = ({ width, height, duration, children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [frameCount, setFrameCount] = useState(0);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const elementsRef = useRef<Map<string, SceneElement>>(new Map());
  const transitionsRef = useRef<TransitionProps[]>([]);
  const transitionManagerRef = useRef<TransitionManager>(new TransitionManager());

  const registerElement = (id: string, element: SceneElement) => {
    elementsRef.current.set(id, element);
  };

  const getElement = (id: string) => {
    return elementsRef.current.get(id);
  };

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      setCanvasContext(ctx);
    }
  }, []);

  const sceneContext: SceneContext = {
    elements: elementsRef.current,
    transitions: transitionsRef.current,
    frameCount,
    canvasContext: canvasContext!,
    registerElement,
    getElement
  };

  // Extract transitions from children
  useEffect(() => {
    const extractTransitions = (children: React.ReactNode): TransitionProps[] => {
      const transitions: TransitionProps[] = [];
      
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === Transition) {
          transitions.push(child.props as TransitionProps);
        }
      });
      
      return transitions;
    };

    const transitions = extractTransitions(children);
    transitionsRef.current = transitions;
    
    // Add transitions to manager
    transitions.forEach((transition, index) => {
      transitionManagerRef.current.addTransition(`transition_${index}`, transition);
    });
  }, [children]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasContext) return;

    let animationId: number;
    let currentFrame = 0;
    const fps = 60;

    const animate = () => {
      // Clear canvas
      canvasContext.clearRect(0, 0, width, height);
      
      // Update frame count
      setFrameCount(currentFrame);
      
      // Update transitions
      transitionManagerRef.current.updateTransitions(currentFrame, elementsRef.current);
      
      // Render all elements
      if (elementsRef.current.size > 0) {
        console.log('Frame', currentFrame, '- Elements to render:', elementsRef.current.size);
      }
      
      elementsRef.current.forEach((element, id) => {
        if (element.drawable && element.props.visible !== false) {
          // Update the drawable's canvas context with current frame
          element.drawable.setCanvasContext({ ctx: canvasContext, frameCount: currentFrame });
          element.drawable.show();
        }
      });

      currentFrame++;
      
      // Continue animation if within duration
      if (currentFrame < duration * fps) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    animationRef.current = animationId;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, duration, canvasContext]);

  return (
    <SceneContextProvider.Provider value={sceneContext}>
      <div style={{ position: 'relative', width, height }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            border: '1px solid #ccc',
            backgroundColor: '#000'
          }}
        />
        <div style={{ display: 'none' }}>
          {children}
        </div>
      </div>
    </SceneContextProvider.Provider>
  );
};

// Placeholder for Transition component
export const Transition: React.FC<TransitionProps> = () => {
  return null; // This component doesn't render anything
};
