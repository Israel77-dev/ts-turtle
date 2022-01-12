// ========== Points ==========

abstract class _Point<N extends number> {}

interface Point2D extends _Point<2> {
  x: number;
  y: number;
}

interface PolarPoint extends _Point<2> {
  radius: number;
  angle: number;
}

// ========== Vectors ==========

abstract class _Vector<N extends number> {
  abstract get cartesianComponents(): number[];

  abstract get unit(): _Vector<N>;

  abstract add(other: _Vector<N>): _Vector<N>;

  abstract multiply(value: number): _Vector<N>;

  abstract dot(other: _Vector<N>): number;

  subtract(other: _Vector<N>): _Vector<N> {
    return this.add(other.multiply(-1));
  }

  get norm(): number {
    return Math.hypot(...this.cartesianComponents);
  }
}

export class Vec2D extends _Vector<2> implements Point2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  override add(other: Vec2D): Vec2D {
    return new Vec2D(this.x + other.x, this.y + other.y);
  }

  override multiply(value: number): Vec2D {
    return new Vec2D(this.x * value, this.y * value);
  }

  override dot(other: Vec2D): number {
    return this.x * other.x + this.y * other.y;
  }

  override get cartesianComponents(): [number, number] {
    return [this.x, this.y];
  }

  override get unit(): Vec2D {
    return new Vec2D(...this.cartesianComponents).multiply(1 / this.norm);
  }

  fromPoint(point: Point2D): Vec2D {
    return new Vec2D(point.x, point.y);
  }

  fromPolar(polarCoordinates: PolarPoint): Vec2D {
    const _r = polarCoordinates.radius;
    const _t = polarCoordinates.angle;
    const _x = _r * Math.cos(_t);
    const _y = _r * Math.sin(_t);

    return new Vec2D(_x, _y);
  }

  toPolar(): PolarPoint {
    const _r = this.norm;
    const _ang = Math.atan2(this.y, this.x);

    return {
      radius: _r,
      angle: _ang,
    };
  }
}

// ========== Trigonometry ==========
/**
 * A function that takes an angle in degrees and returns its value in radians
 * @param {number} angle
 * @returns {number}
 */
export const toRadians = (angle: number) => (angle * Math.PI) / 180;

/**
 * A function that takes an angle in radians and returns its value in degrees
 * @param {number} angle
 * @returns {number}
 */
export const toDegrees = (angle: number) => (angle * 180) / Math.PI;

// ========== Random ==========

/**
 * A function that takes two numbers and returns a pseudorandom number between them.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomBetween = (min: number, max: number): number =>
  min + (max - min) * Math.random();
