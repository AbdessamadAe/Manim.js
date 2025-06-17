# ManimJs Library Architecture

This document explains the refactored architecture of the Manim.js library, designed to be modular and extensible.

## Directory Structure

```
lib/
├── core/                    # Core functionality and base classes
│   ├── types.ts            # Common interfaces and types
│   ├── drawable.ts         # Base class for all drawable objects
│   └── index.ts            # Core exports
├── utils/                   # Shared utilities
│   ├── timer.ts            # Animation timing functions
│   ├── math.ts             # Mathematical utilities
│   ├── colors.ts           # Color utilities and constants
│   └── index.ts            # Utility exports
├── components/              # Individual components
│   ├── circle/             # Circle component
│   │   ├── types.ts        # Circle-specific types
│   │   ├── pie.ts          # Pie/Arc base class
│   │   ├── circle.ts       # Circle drawable class
│   │   └── index.tsx       # React component wrapper
│   └── line/               # Line component (example)
│       ├── types.ts        # Line-specific types
│       ├── line.ts         # Line drawable class
│       └── index.ts        # Line exports
└── main.ts                 # Main library exports
```

## Core Architecture

### 1. DrawableBase Class (`core/drawable.ts`)

The foundation class that all drawable components extend from. Provides:

- **Position management**: `x`, `y` coordinates
- **Animation timing**: `start`, `duration`, `end` properties
- **Movement animations**: `move()`, `shift()` methods
- **Canvas context management**: Automatic context updates
- **Base rendering setup**: Common drawing properties

```typescript
export class DrawableBase {
  protected ctx: CanvasRenderingContext2D;
  protected canvasContext: CanvasContext;
  public x: number;
  public y: number;
  // ... other common properties
  
  constructor(canvasContext: CanvasContext, props: BaseDrawableProps);
  move(x: number, y: number, duration?: number): void;
  shift(deltaX: number, deltaY: number, duration?: number): void;
  protected showSetup(): void;
  show(): void; // Must be implemented by subclasses
}
```

### 2. Animation System (`utils/timer.ts`)

Flexible animation timing system with multiple easing functions:

- **Timer**: Base timer class
- **LinearTimer**: Constant speed animation
- **DeceleratingTimer**: Ease-out animation (matches original Manim.js)
- **AcceleratingTimer**: Ease-in animation
- **EaseInOutTimer**: Smooth start and end

```typescript
// Create different types of animations
const linear = new LinearTimer(frames(2));
const smooth = new DeceleratingTimer(frames(2));
const easeInOut = new EaseInOutTimer(frames(2));

// Or use the factory function
const timer = createTimer(frames(2), 'decelerate');
```

### 3. Utility Functions

#### Math utilities (`utils/math.ts`)
- `lerp()`, `clamp()`, `map()` - Common mathematical operations
- `distance()`, `angle()` - Geometric calculations
- `toRadians()`, `toDegrees()` - Angle conversions

#### Color utilities (`utils/colors.ts`)
- `parseColor()` - Convert various color formats to CSS strings
- `lerpColor()` - Interpolate between colors
- `Colors` - Predefined color constants

## Creating New Components

To create a new component, follow this pattern:

### 1. Define Types (`components/yourcomponent/types.ts`)

```typescript
import type { BaseDrawableProps } from '../../core/types';

export interface YourComponentProps extends BaseDrawableProps {
  // Component-specific properties
  width?: number;
  height?: number;
}
```

### 2. Create Drawable Class (`components/yourcomponent/drawable.ts`)

```typescript
import { DrawableBase } from '../../core/drawable';
import { LinearTimer, frames } from '../../utils/timer';
import type { CanvasContext } from '../../core/types';
import type { YourComponentProps } from './types';

export class YourComponentDrawable extends DrawableBase {
  protected timer: LinearTimer;
  protected width: number;
  protected height: number;

  constructor(canvasContext: CanvasContext, props: YourComponentProps = {}) {
    super(canvasContext, props);
    
    this.width = props.width || 100;
    this.height = props.height || 100;
    this.timer = new LinearTimer(frames(this.duration));
  }

  show(): void {
    if (this.shouldRender()) {
      this.showSetup();
      
      const progress = this.timer.advance();
      
      // Your drawing logic here
      this.ctx.beginPath();
      // ... drawing commands ...
      this.ctx.stroke();
    }
  }

  isAnimationComplete(): boolean {
    return this.timer.isComplete();
  }
}
```

### 3. Create React Component (Optional)

If you want a React wrapper, create an `index.tsx` similar to the Circle component.

### 4. Export from Main Library

Add your component to `lib/main.ts`:

```typescript
// Add to main.ts
export { YourComponent, YourComponentDrawable } from './components/yourcomponent';
export type { YourComponentProps } from './components/yourcomponent';
```

## Benefits of This Architecture

1. **Modularity**: Each component is self-contained but shares common functionality
2. **Reusability**: Core utilities can be used across all components
3. **Extensibility**: Easy to add new components without duplicating code
4. **Type Safety**: Full TypeScript support throughout
5. **Performance**: Minimal overhead with shared base classes
6. **Maintainability**: Clear separation of concerns

## Example Usage

```typescript
import { Circle, LineDrawable, Colors, createTimer } from 'manimjs';

// Using React component
<Circle
  x={150}
  y={150}
  radius={60}
  color={Colors.BLUE}
  duration={2}
  animated={true}
/>

// Using drawable classes directly
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const canvasContext = { ctx, frameCount: 0 };

const line = new LineDrawable(canvasContext, {
  x1: 0, y1: 0,
  x2: 100, y2: 100,
  color: Colors.RED,
  duration: 1.5
});

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.frameCount++;
  line.show();
  if (!line.isAnimationComplete()) {
    requestAnimationFrame(animate);
  }
}
animate();
```

This architecture provides a solid foundation for building complex animations while maintaining the simplicity and elegance of the original Manim.js approach.
