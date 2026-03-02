import { InvalidCategoryException } from '../exceptions/domain.exceptions';

export class Category {
  constructor(
    private readonly _id: string | null,
    private _name: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new InvalidCategoryException('Category name is required');
    }

    if (this._name.length > 100) {
      throw new InvalidCategoryException('Category name must not exceed 100 characters');
    }
  }

  get id(): string | null {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidCategoryException('Category name is required');
    }

    if (name.length > 100) {
      throw new InvalidCategoryException('Category name must not exceed 100 characters');
    }

    this._name = name;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  static create(name: string): Category {
    const now = new Date();
    return new Category(null, name, now, now, null);
  }

  static reconstitute(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Category {
    return new Category(id, name, createdAt, updatedAt, deletedAt);
  }
}
