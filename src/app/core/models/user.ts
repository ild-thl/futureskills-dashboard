import { ObjectPermission, UserRoles } from './permissions';

export type UserStorageData = Pick<User, "token" | "tokenExpirationDate">

export class User {
  constructor(
    public id: number,
    public email: string,
    public name: string,
    public role: UserRoles,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _objectPermissions: ObjectPermission[]
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }

  public get objectPermissions(): ObjectPermission[] {
    return this._objectPermissions;
  }

  public set objectPermissions(value: ObjectPermission[]) {
    this._objectPermissions = value;
  }
}
