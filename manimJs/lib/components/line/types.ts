import type { BaseDrawableProps } from '../../core/types';

export interface LineProps extends BaseDrawableProps {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  lineCap?: CanvasLineCap;
}
