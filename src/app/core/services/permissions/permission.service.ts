import { Injectable } from '@angular/core';
import { Objects, Permissions } from 'src/app/core/models/permissions';
import { User } from 'src/app/core/models/user';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor() {}

  checkPermission(user: User, object: Objects, permissionToCheck: Permissions): boolean {
    const objectPermissions = user.objectPermissions.find((f) => {
      return f.object === object;
    });

    if (!!objectPermissions) {
      switch (permissionToCheck) {
        case Permissions.ADMINACCESS:
          return objectPermissions.permission === Permissions.ADMINACCESS;
      }
    }
    return false;
  }
}
