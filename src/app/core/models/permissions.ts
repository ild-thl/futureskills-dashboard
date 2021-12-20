export enum Objects {
  OFFERS = 'offers',
}

export enum Permissions {
  NONE = 'none',
  ADMINACCESS = 'adminaccess',
}

export enum UserRoles {
  ADMIN = 'admin',
  DEFAULT = 'default',
}

export class ObjectPermission {
  object: Objects;
  permission: Permissions;
}


