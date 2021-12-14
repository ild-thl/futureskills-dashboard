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
    private _featurePermissions: ObjectPermission[]
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

  public get featurePermissions(): ObjectPermission[] {
    return this._featurePermissions;
  }

  public set featurePermissions(value: ObjectPermission[]) {
    this._featurePermissions = value;
  }
}
