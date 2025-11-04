/**
 * DOMMatrix polyfill for serverless environments (Vercel)
 * pdf-parse (via pdfjs-dist) requires DOMMatrix which is not available in Node.js
 * This polyfill must be loaded BEFORE any pdf-parse imports
 *
 * CRITICAL: This module is imported at the very top of API routes to ensure
 * DOMMatrix is available before pdf-parse (via pdfjs-dist) tries to use it.
 */

// Execute polyfill setup immediately at module load time
// This ensures DOMMatrix is available before any other imports execute

// Only set up polyfill if DOMMatrix is not already defined
if (typeof globalThis.DOMMatrix === "undefined") {
  // Minimal DOMMatrix polyfill for pdfjs-dist
  // This implements the basic functionality needed by pdfjs-dist
  class DOMMatrixPolyfill {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    m11: number;
    m12: number;
    m21: number;
    m22: number;
    m41: number;
    m42: number;

    constructor(init?: string | number[]) {
      if (typeof init === "string") {
        // Parse matrix string like "matrix(a, b, c, d, e, f)"
        const match = init.match(/matrix\(([^)]+)\)/);
        if (match) {
          const values = match[1].split(",").map((v) => parseFloat(v.trim()));
          this.a = values[0] || 1;
          this.b = values[1] || 0;
          this.c = values[2] || 0;
          this.d = values[3] || 1;
          this.e = values[4] || 0;
          this.f = values[5] || 0;
        } else {
          this.a = this.d = 1;
          this.b = this.c = this.e = this.f = 0;
        }
      } else if (Array.isArray(init)) {
        this.a = init[0] ?? 1;
        this.b = init[1] ?? 0;
        this.c = init[2] ?? 0;
        this.d = init[3] ?? 1;
        this.e = init[4] ?? 0;
        this.f = init[5] ?? 0;
      } else {
        this.a = this.d = 1;
        this.b = this.c = this.e = this.f = 0;
      }

      // Map to matrix properties
      this.m11 = this.a;
      this.m12 = this.b;
      this.m21 = this.c;
      this.m22 = this.d;
      this.m41 = this.e;
      this.m42 = this.f;
    }

    // Basic methods that pdfjs-dist might need
    multiply(other: DOMMatrixPolyfill): DOMMatrixPolyfill {
      const result = new DOMMatrixPolyfill();
      result.a = this.a * other.a + this.c * other.b;
      result.b = this.b * other.a + this.d * other.b;
      result.c = this.a * other.c + this.c * other.d;
      result.d = this.b * other.c + this.d * other.d;
      result.e = this.a * other.e + this.c * other.f + this.e;
      result.f = this.b * other.e + this.d * other.f + this.f;
      result.m11 = result.a;
      result.m12 = result.b;
      result.m21 = result.c;
      result.m22 = result.d;
      result.m41 = result.e;
      result.m42 = result.f;
      return result;
    }

    translate(x: number, y: number): DOMMatrixPolyfill {
      const translate = new DOMMatrixPolyfill([1, 0, 0, 1, x, y]);
      return this.multiply(translate);
    }

    scale(x: number, y?: number): DOMMatrixPolyfill {
      const scaleY = y ?? x;
      const scale = new DOMMatrixPolyfill([x, 0, 0, scaleY, 0, 0]);
      return this.multiply(scale);
    }
  }

  // Set on globalThis (works in both Node.js and browser-like environments)
  // This must be done synchronously at module load time
  (globalThis as any).DOMMatrix = DOMMatrixPolyfill;
  (globalThis as any).DOMMatrixReadOnly = DOMMatrixPolyfill;

  // Also set on global for Node.js environments (Vercel serverless)
  if (typeof global !== "undefined") {
    (global as any).DOMMatrix = DOMMatrixPolyfill;
    (global as any).DOMMatrixReadOnly = DOMMatrixPolyfill;
  }

  // Set on window if available (for compatibility)
  if (typeof window !== "undefined") {
    (window as any).DOMMatrix = DOMMatrixPolyfill;
    (window as any).DOMMatrixReadOnly = DOMMatrixPolyfill;
  }

  // Verify polyfill is set
  if (typeof globalThis.DOMMatrix !== "undefined") {
    console.log("[DOMMatrix Polyfill] DOMMatrix polyfill loaded successfully");
  } else {
    console.error("[DOMMatrix Polyfill] Failed to set up DOMMatrix polyfill");
  }
}

// Export a function to verify polyfill is set up (for debugging)
export function verifyDOMMatrixPolyfill(): boolean {
  return typeof globalThis.DOMMatrix !== "undefined";
}
