/**
 * Color utilities for drawing operations
 */

export type Color = string | [number, number, number] | [number, number, number, number];

/**
 * Convert RGB array to CSS color string
 */
export function rgbToString(rgb: [number, number, number] | [number, number, number, number]): string {
  if (rgb.length === 3) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  } else {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${rgb[3]})`;
  }
}

/**
 * Parse color to CSS string
 */
export function parseColor(color: Color): string {
  if (typeof color === 'string') {
    return color;
  }
  return rgbToString(color);
}

/**
 * Interpolate between two colors
 */
export function lerpColor(
  color1: [number, number, number], 
  color2: [number, number, number], 
  t: number
): [number, number, number] {
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * t),
    Math.round(color1[1] + (color2[1] - color1[1]) * t),
    Math.round(color1[2] + (color2[2] - color1[2]) * t)
  ];
}

/**
 * Common colors used in Manim
 */
export const Colors = {
  WHITE: '#ffffff',
  RED: '#ff4d61',
  GREEN: '#4dd94d',
  BLUE: '#4db1ff',
  YELLOW: '#f7e32f',
  ORANGE: '#f7891b',
  PURPLE: '#9d4dff',
  PINK: '#ff4dd9',
  CYAN: '#4dffff',
  BLACK: '#000000',
  GRAY: '#808080',
  LIGHT_GRAY: '#c0c0c0',
  DARK_GRAY: '#404040'
} as const;
