import { interpolate } from 'flubber';

/**
 * Interface for shapes that can provide SVG path representations
 */
export interface PathMorphable {
  /**
   * Generate an SVG path string representing the shape's current state
   * @returns SVG path string (e.g., "M 0,0 L 100,0 L 100,100 L 0,100 Z")
   */
  getPath(): string;
  
  /**
   * Render from an SVG path string during morphing
   * @param pathString SVG path string to render
   */
  renderFromPath(pathString: string): void;
}

/**
 * Cached interpolator for efficient morphing between the same shape pairs
 */
interface CachedInterpolator {
  fromPath: string;
  toPath: string;
  interpolator: (t: number) => string;
  lastUsed: number;
}

/**
 * Path-based morphing system using Flubber for smooth geometric transitions
 */
export class PathMorphEngine {
  private static instance: PathMorphEngine;
  private interpolatorCache = new Map<string, CachedInterpolator>();
  private readonly MAX_CACHE_SIZE = 50;
  private readonly CACHE_TTL = 60000; // 1 minute

  private constructor() {}

  static getInstance(): PathMorphEngine {
    if (!PathMorphEngine.instance) {
      PathMorphEngine.instance = new PathMorphEngine();
    }
    return PathMorphEngine.instance;
  }

  /**
   * Create or retrieve a cached interpolator for morphing between two shapes
   */
  getInterpolator(fromShape: PathMorphable, toShape: PathMorphable): (t: number) => string {
    const fromPath = fromShape.getPath();
    const toPath = toShape.getPath();
    const cacheKey = this.generateCacheKey(fromPath, toPath);

    // Check cache first
    const cached = this.interpolatorCache.get(cacheKey);
    if (cached && cached.fromPath === fromPath && cached.toPath === toPath) {
      cached.lastUsed = Date.now();
      return cached.interpolator;
    }

    // Create new interpolator
    const interpolator = this.createInterpolator(fromPath, toPath);
    
    // Cache it
    this.cacheInterpolator(cacheKey, fromPath, toPath, interpolator);
    
    return interpolator;
  }

  /**
   * Create an interpolator between two SVG paths
   */
  private createInterpolator(fromPath: string, toPath: string): (t: number) => string {
    try {
      return interpolate(fromPath, toPath);
    } catch (error) {
      console.warn('Flubber interpolation failed, falling back to direct transition:', error);
      // Fallback: direct transition at t=0.5
      return (t: number) => t < 0.5 ? fromPath : toPath;
    }
  }

  /**
   * Generate a cache key for the interpolator
   */
  private generateCacheKey(fromPath: string, toPath: string): string {
    // Use a hash of both paths for efficient key generation
    return `${this.simpleHash(fromPath)}_${this.simpleHash(toPath)}`;
  }

  /**
   * Simple hash function for cache keys
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Cache an interpolator with LRU-style eviction
   */
  private cacheInterpolator(
    key: string, 
    fromPath: string, 
    toPath: string, 
    interpolator: (t: number) => string
  ): void {
    // Clean up cache if it's getting too large
    if (this.interpolatorCache.size >= this.MAX_CACHE_SIZE) {
      this.cleanupCache();
    }

    this.interpolatorCache.set(key, {
      fromPath,
      toPath,
      interpolator,
      lastUsed: Date.now()
    });
  }

  /**
   * Clean up old cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    const entriesArray = Array.from(this.interpolatorCache.entries());
    
    // Remove expired entries
    const validEntries = entriesArray.filter(([_, cached]) => 
      now - cached.lastUsed < this.CACHE_TTL
    );

    // If still too many, remove oldest
    if (validEntries.length >= this.MAX_CACHE_SIZE) {
      validEntries.sort((a, b) => b[1].lastUsed - a[1].lastUsed);
      validEntries.splice(this.MAX_CACHE_SIZE * 0.8); // Keep 80% of max
    }

    // Rebuild cache
    this.interpolatorCache.clear();
    validEntries.forEach(([key, cached]) => {
      this.interpolatorCache.set(key, cached);
    });
  }

  /**
   * Manually clear the cache (useful for memory management)
   */
  clearCache(): void {
    this.interpolatorCache.clear();
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats(): { size: number; maxSize: number; hitRatio?: number } {
    return {
      size: this.interpolatorCache.size,
      maxSize: this.MAX_CACHE_SIZE
    };
  }
}

/**
 * Utility functions for common path generation
 */
export class PathUtils {
  /**
   * Generate a circle path
   */
  static circle(cx: number, cy: number, radius: number): string {
    // Use arc commands for a perfect circle
    return `M ${cx + radius},${cy} A ${radius},${radius} 0 1,1 ${cx - radius},${cy} A ${radius},${radius} 0 1,1 ${cx + radius},${cy} Z`;
  }

  /**
   * Generate a rectangle path
   */
  static rectangle(x: number, y: number, width: number, height: number): string {
    return `M ${x},${y} L ${x + width},${y} L ${x + width},${y + height} L ${x},${y + height} Z`;
  }

  /**
   * Generate a square path (convenience method)
   */
  static square(x: number, y: number, size: number): string {
    return PathUtils.rectangle(x - size/2, y - size/2, size, size);
  }

  /**
   * Generate a line path
   */
  static line(x1: number, y1: number, x2: number, y2: number): string {
    return `M ${x1},${y1} L ${x2},${y2}`;
  }

  /**
   * Generate a star path
   */
  static star(cx: number, cy: number, outerRadius: number, innerRadius: number, points: number = 5): string {
    const path: string[] = [];
    const angleStep = (Math.PI * 2) / (points * 2);
    
    for (let i = 0; i < points * 2; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      
      if (i === 0) {
        path.push(`M ${x},${y}`);
      } else {
        path.push(`L ${x},${y}`);
      }
    }
    
    path.push('Z');
    return path.join(' ');
  }

  /**
   * Generate a polygon path
   */
  static polygon(cx: number, cy: number, radius: number, sides: number): string {
    const path: string[] = [];
    const angleStep = (Math.PI * 2) / sides;
    
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      
      if (i === 0) {
        path.push(`M ${x},${y}`);
      } else {
        path.push(`L ${x},${y}`);
      }
    }
    
    path.push('Z');
    return path.join(' ');
  }

  /**
   * Normalize a path to ensure it's closed and has sufficient points for smooth morphing
   */
  static normalizePath(path: string, minPoints: number = 8): string {
    // This is a simplified version - in production you might want more sophisticated path normalization
    if (!path.trim().endsWith('Z')) {
      path += ' Z';
    }
    return path;
  }
}
