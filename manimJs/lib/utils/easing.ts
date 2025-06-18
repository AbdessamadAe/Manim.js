export type EasingFunction = (t: number) => number;

export const easingFunctions: Record<string, EasingFunction> = {
  linear: (t: number) => t,
  
  easeIn: (t: number) => t * t,
  
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  
  easeInOut: (t: number) => {
    if (t < 0.5) {
      return 2 * t * t;
    }
    return 1 - Math.pow(-2 * t + 2, 2) / 2;
  },
  
  easeInCubic: (t: number) => t * t * t,
  
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  
  easeInOutCubic: (t: number) => {
    if (t < 0.5) {
      return 4 * t * t * t;
    }
    return 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
};

export function getEasingFunction(name: string): EasingFunction {
  return easingFunctions[name] || easingFunctions.linear;
}
