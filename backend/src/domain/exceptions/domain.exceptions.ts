export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    // Fixes the prototype chain broken by TypeScript → ES5 transpilation.
    // Without this, `instanceof DomainException` can silently return false.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidRecipeException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRecipeException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidCategoryException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCategoryException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidUserException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
