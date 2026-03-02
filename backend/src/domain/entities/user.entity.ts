import { InvalidUserException } from '../exceptions/domain.exceptions';

export class User {
  constructor(
    private readonly _id: string | null,
    private _name: string | null,
    private readonly _login: string,
    private _password: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null = null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this._login || this._login.trim().length === 0) {
      throw new InvalidUserException('Login is required');
    }
    if (!this._password || this._password.trim().length === 0) {
      throw new InvalidUserException('Password is required');
    }
  }

  get id(): string | null {
    return this._id;
  }

  get name(): string | null {
    return this._name;
  }

  get login(): string {
    return this._login;
  }

  get password(): string {
    return this._password;
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

  softDelete(): void {
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  updateName(name: string | null): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updatePassword(password: string): void {
    this._password = password;
    this._updatedAt = new Date();
  }

  static create(login: string, password: string, name?: string | null): User {
    const now = new Date();
    return new User(null, name || null, login, password, now, now, null);
  }

  static reconstitute(
    id: string,
    name: string | null,
    login: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
  ): User {
    return new User(id, name, login, password, createdAt, updatedAt, deletedAt);
  }
}
