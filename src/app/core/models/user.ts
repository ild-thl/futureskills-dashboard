import { ObjectPermission, UserRoles } from './permissions';

export class User {
  constructor(
    public id: number,
    public email: string | undefined,
    public name: string,
    public role: UserRoles,
   // private _token: string,
    private _objectPermissions: ObjectPermission[]
  ) {}

  // get token() {
  //   return this._token;
  // }

  public get objectPermissions(): ObjectPermission[] {
    return this._objectPermissions;
  }

  public set objectPermissions(value: ObjectPermission[]) {
    this._objectPermissions = value;
  }
}
