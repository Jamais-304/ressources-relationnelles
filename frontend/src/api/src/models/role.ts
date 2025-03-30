export enum Role {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
  SuperAdmin = 'super-admin',
}

/**
 * Converts a string role to a Role enum value.
 * @param role - The string role to convert.
 * @returns The corresponding Role enum value.
 * @throws An error if the role is not recognized.
 */
export function roleFromString(role: string): Role {
  switch (role) {
    case 'utilisateur':
      return Role.User
    case 'moderateur':
      return Role.Moderator
    case 'administrateur':
      return Role.Admin
    case 'super-administrateur':
      return Role.SuperAdmin
    default:
      throw new Error(`Unrecognized role: ${role}`)
  }
}

/**
 * Converts a Role enum value to its string representation.
 * @param role - The Role enum value to convert.
 * @returns The corresponding string role.
 */
export function roleToString(role: Role): string {
  switch (role) {
    case Role.User:
      return 'utilisateur'
    case Role.Moderator:
      return 'moderateur'
    case Role.Admin:
      return 'administrateur'
    case Role.SuperAdmin:
      return 'super-administrateur'
    default:
      throw new Error(`Unrecognized role: ${role}`)
  }
}
