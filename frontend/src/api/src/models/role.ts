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
    case 'user':
      return Role.User
    case 'moderator':
      return Role.Moderator
    case 'admin':
      return Role.Admin
    case 'super-admin':
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
  return role.toString()
}
