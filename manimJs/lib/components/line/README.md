# Line Component

The Line component is a perfect example of how the refactored Manim.js architecture enables easy creation of new animated components.

## Features

- **Animated drawing** from start point to end point
- **Customizable appearance** with color, stroke width, and line caps
- **Timing control** with start/end frames for sequenced animations
- **Shared architecture** using the same base classes as other components
- **Mathematical utilities** for automatic length calculation

## Basic Usage

```tsx
import { Line, Colors } from 'manimjs';

<Line
  x1={50}
  y1={50}
  x2={250}
  y2={250}
  color={Colors.CYAN}
  strokeWidth={4}
  duration={2}
  animated={true}
/>
```

## Props

All props from `BaseDrawableProps` plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `x1` | `number` | `0` | Start x coordinate |
| `y1` | `number` | `0` | Start y coordinate |
| `x2` | `number` | `100` | End x coordinate |
| `y2` | `number` | `0` | End y coordinate |
| `lineCap` | `CanvasLineCap` | `'round'` | Line cap style: 'round', 'square', 'butt' |

## Advanced Usage

### Sequential Animation

```tsx
<div style={{ position: 'relative' }}>
  <Circle x={150} y={150} radius={80} color={Colors.BLUE} duration={2} />
  <Line x1={70} y1={150} x2={230} y2={150} color={Colors.RED} start={60} />
  <Line x1={150} y1={70} x2={150} y2={230} color={Colors.RED} start={90} />
</div>
```

### Using the Drawable Class Directly

```typescript
import { LineDrawable } from 'manimjs';

const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const canvasContext = { ctx, frameCount: 0 };

const line = new LineDrawable(canvasContext, {
  x1: 0, y1: 0, x2: 100, y2: 100,
  color: '#ff0000',
  strokeWidth: 3,
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
```

## Architecture Benefits

The Line component demonstrates how the refactored architecture makes it easy to create new components:

1. **Extends DrawableBase** - Gets position, movement, and timing functionality for free
2. **Uses shared utilities** - Math functions, timers, and color parsing
3. **Follows same patterns** - Consistent API with other components
4. **Type-safe** - Full TypeScript support throughout

This same pattern can be used to create rectangles, polygons, text, and any other drawable shapes!
