import { Role, roleFromString, roleToString } from './role'

export interface UserData {
  uuid: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role: string[]
}

export class User implements UserData {
  uuid: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role: Role[]

  /**
   * Creates an instance of User.
   * @param data - The data to initialize the User instance.
   */
  constructor(data: UserData) {
    this.uuid = data.uuid
    this.email = data.email
    this.username = data.username
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.role = data.role.map(roleFromString)
  }

  /**
   * Creates a User instance from a JSON object.
   * @param data - The JSON object to create the User instance from.
   * @returns A new User instance.
   */
  static fromJson(data: UserData): User {
    return new User(data)
  }

  /**
   * Converts the User instance to a JSON object.
   * @returns A JSON object representing the User instance.
   */
  toJson(): UserData {
    return {
      uuid: this.uuid,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role.map(roleToString),
    }
  }
}
