import { InvalidRecipeException } from '../exceptions/domain.exceptions';

export class Recipe {
  constructor(
    private readonly _id: string | null,
    private readonly _userId: string,
    private _categoryId: string | null,
    private _name: string | null,
    private _preparationTimeMinutes: number | null,
    private _servings: number | null,
    private _preparationMethod: string,
    private _ingredients: string | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._userId || this._userId.trim().length === 0) {
      throw new InvalidRecipeException('User ID is required');
    }

    if (!this._preparationMethod || this._preparationMethod.trim().length === 0) {
      throw new InvalidRecipeException('Preparation method is required');
    }

    if (this._preparationTimeMinutes !== null && this._preparationTimeMinutes < 0) {
      throw new InvalidRecipeException('Preparation time cannot be negative');
    }

    if (this._servings !== null && this._servings < 1) {
      throw new InvalidRecipeException('Servings must be at least 1');
    }
  }

  get id(): string | null {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get categoryId(): string | null {
    return this._categoryId;
  }

  get name(): string | null {
    return this._name;
  }

  get preparationTimeMinutes(): number | null {
    return this._preparationTimeMinutes;
  }

  get servings(): number | null {
    return this._servings;
  }

  get preparationMethod(): string {
    return this._preparationMethod;
  }

  get ingredients(): string | null {
    return this._ingredients;
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

  update(data: {
    name?: string | null;
    categoryId?: string | null;
    preparationTimeMinutes?: number | null;
    servings?: number | null;
    preparationMethod?: string;
    ingredients?: string | null;
  }): void {
    if (data.name !== undefined) this._name = data.name;
    if (data.categoryId !== undefined) this._categoryId = data.categoryId;
    if (data.preparationTimeMinutes !== undefined) {
      if (data.preparationTimeMinutes !== null && data.preparationTimeMinutes < 0) {
        throw new InvalidRecipeException('Preparation time cannot be negative');
      }
      this._preparationTimeMinutes = data.preparationTimeMinutes;
    }
    if (data.servings !== undefined) {
      if (data.servings !== null && data.servings < 1) {
        throw new InvalidRecipeException('Servings must be at least 1');
      }
      this._servings = data.servings;
    }
    if (data.preparationMethod !== undefined) {
      if (!data.preparationMethod || data.preparationMethod.trim().length === 0) {
        throw new InvalidRecipeException('Preparation method is required');
      }
      this._preparationMethod = data.preparationMethod;
    }
    if (data.ingredients !== undefined) this._ingredients = data.ingredients;
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

  static create(
    userId: string,
    preparationMethod: string,
    categoryId?: string | null,
    name?: string | null,
    preparationTimeMinutes?: number | null,
    servings?: number | null,
    ingredients?: string | null,
  ): Recipe {
    const now = new Date();
    return new Recipe(
      null,
      userId,
      categoryId ?? null,
      name ?? null,
      preparationTimeMinutes ?? null,
      servings ?? null,
      preparationMethod,
      ingredients ?? null,
      now,
      now,
      null,
    );
  }

  static reconstitute(
    id: string,
    userId: string,
    categoryId: string | null,
    name: string | null,
    preparationTimeMinutes: number | null,
    servings: number | null,
    preparationMethod: string,
    ingredients: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Recipe {
    return new Recipe(
      id,
      userId,
      categoryId,
      name,
      preparationTimeMinutes,
      servings,
      preparationMethod,
      ingredients,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}
