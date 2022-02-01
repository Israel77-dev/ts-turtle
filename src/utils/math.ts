/**
 * A module containing math related utilities and definitions.
 * @module
 */

// ========== Points ==========
/**
 * An abstract base class for representing a point in a N-dimensional space
 * @template N - The dimension the point lives in.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class _Point<N extends number> {}

/**
 * A point in 2d space, represented by cartesian coordinates
 */
export interface Point2D extends _Point<2> {
  x: number;
  y: number;
}
/**
 * A point in 2d space, represented by polar coordinates
 */
export interface PolarPoint extends _Point<2> {
  radius: number;
  angle: number;
}

// ========== Vectors ==========

/**
 * An abstract base class meant to represent a N-dimensional euclidean vector
 * and its operations.
 * @template N - The dimension of the vector.
 */
abstract class _Vector<N extends number> {
  /**
   * The cartesian components of the vector as an Array of scalars.
   */
  abstract get cartesianComponents(): number[];

  /**
   * The unit vector in the direction of this vector.
   */
  abstract get unit(): _Vector<N>;

  /**
   * Returns the result of the addition of this vector plus another.
   * Does not modify the current vector.
   * @param other The other vector to add.
   * @returns Result of the addition
   */
  abstract add(other: _Vector<N>): _Vector<N>;

  /**
   * Returns the result of the multiplication of the current vector by
   * a given scalar.
   * Does not modify the current vector.
   * @param value The scalar to multiply by this vector.
   * @returns Result of the multiplication
   */
  abstract multiply(value: number): _Vector<N>;

  /**
   * Returns the result of dot product (an inner product in euclidean space) of this vector by another.
   * @param other The other vector.
   * @returns Result of the dot product
   */
  abstract dot(other: _Vector<N>): number;

  /**
   * Returns the result of the subtraction of another vector from the current one.
   * Does not modify the current vector.
   * @param other The other vector to subtract
   * @returns Result from subtraction
   */
  subtract(other: _Vector<N>): _Vector<N> {
    return this.add(other.multiply(-1));
  }

  /**
   * The norm (i.e. length) of the current vector.
   */
  get norm(): number {
    return Math.hypot(...this.cartesianComponents);
  }
}

/**
 * A class that represents a 2-dimensional euclidean vector and is compatible with
 * the cartesian representation of a point in 2d space.
 */
export class Vec2D extends _Vector<2> implements Point2D {
  /** @property The first cartesian coordinate (abscissa) of the vector */
  public x: number;
  /** @property The second cartesian coordinate (ordinate) of the vector */
  public y: number;

  /**
   * Creates a 2-dimensional vector given its cartesian coordinates
   * @param x The first cartesian coordinate (abscissa) of the vector
   * @param y The second cartesian coordinate (ordinate) of the vector
   */
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

  /**
   * Returns the result of a counter-clockwise the current vector arround the origin by a given {@link angle}.
   * @param angle The angle to rotate by.
   * @param angleType The unit in which the angle is measured, defaults to Radians.
   * @returns The rotated vector
   */
  rotate(angle: number, angleType?: "Degrees" | "Radians"): Vec2D {
    angleType = angleType || "Radians";

    if (angleType === "Degrees") {
      angle = toRadians(angle);
    }

    const [_st, _ct] = [Math.sin(angle), Math.cos(angle)];

    return new Vec2D(this.x * _ct - this.y * _st, this.x * _st + this.y * _ct);
  }

  /**
   * Creates a vector from the origin to a given {@link point} in 2-dimensional space, represented in cartesian coordinates.
   * @param point The point in 2d space.
   * @returns A vector from the origin to given point.
   */
  static fromPoint(point: Point2D): Vec2D {
    return new Vec2D(point.x, point.y);
  }

  /**
   * Creates a vector from the origin to a given point in 2-dimensional space, represented in polar coordinates.
   * @param polarCoordinates Polar coordinates of the point.
   * @returns A vector from the origin to given point.
   */
  static fromPolar(polarCoordinates: PolarPoint): Vec2D {
    const _r = polarCoordinates.radius;
    const _t = polarCoordinates.angle;
    const _x = _r * Math.cos(_t);
    const _y = _r * Math.sin(_t);

    return new Vec2D(_x, _y);
  }

  /**
   * Returns the polar coordinates corresponding to the point whose distance from the origin, in the direction of the current vector,
   * corresponds to the norm of the current vector.
   *
   * In simpler terms, returns the polar coordinates of the point this vector points to.
   * @returns The polar coordinates of the point
   */
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
 * A function that takes an angle in degrees and returns its value in radians.
 * @param {number} angle
 * @returns angle in radians
 */
export const toRadians = (angle: number) => (angle * Math.PI) / 180;

/**
 * A function that takes an angle in radians and returns its value in degrees.
 * @param {number} angle
 * @returns angle in degrees.
 */
export const toDegrees = (angle: number) => (angle * 180) / Math.PI;

// ========== Statistics and randomness ==========

/**
 * A function that takes two numbers and returns a pseudorandom number between them.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomBetween = (min: number, max: number): number =>
  min + (max - min) * Math.random();
