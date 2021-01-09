export default class Vector2 {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static fromArray(arr) {
    if (arr.length !== 2) throw new Error("'arr' length must be 2.");
    return new Vector2(arr[0], arr[1]);
  }

  static dot(u, v) {
    return u.x * v.x + u.y * v.y;
  }

  static distance(v, u) {
    return u.subtract(v).magnitude();
  }

  static angleBetween(a, b) {
    const p = a.x * b.x + a.y * b.y;
    const n = Math.sqrt((a.x ** 2 + a.y ** 2) * (b.x ** 2 + b.y ** 2));
    const sign = a.x * b.y - a.y * b.x < 0 ? -1 : 1;
    const angle = Math.acos(p / n);
    return sign * angle;
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  addScalar(n) {
    return new Vector2(this.x + n, this.y + n);
  }

  subtractScalar(n) {
    return new Vector2(this.x - n, this.y - n);
  }

  multiplyByScalar(n) {
    return new Vector2(this.x * n, this.y * n);
  }

  negate() {
    return new Vector2(-this.x, -this.y);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const magnitude = this.magnitude();
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }

  perpendicular(clockwise = true) {
    return clockwise ? new Vector2(this.y, -this.x) : new Vector2(-this.y, this.x);
  }

  toArray() {
    return [this.x, this.y];
  }
}
