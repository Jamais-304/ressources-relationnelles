import { Role, roleFromString, roleToString } from './role'

export interface UserData {
  _id?: string
  email: string
  pseudonyme: string
  password?: string
  // firstName?: string
  // lastName?: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface IUser {
  uuid?: string
  email: string
  password?: string
  username: string
  // firstName?: string
  // lastName?: string
  role: Role
  createdAt?: string
  updatedAt?: string
}

export class User implements IUser {
  uuid?: string
  email: string
  username: string
  // firstName?: string
  // lastName?: string
  role: Role
  createdAt?: string
  updatedAt?: string

  /**
   * Creates an instance of User.
   * @param data - The data to initialize the User instance.
   */
  constructor(data: UserData) {
    this.uuid = data._id
    this.email = data.email
    this.username = data.pseudonyme
    // this.firstName = data.firstName
    // this.lastName = data.lastName
    this.role = roleFromString(data.role)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
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
  static toJson(attrs: IUser): UserData {
    return {
      _id: attrs.uuid,
      email: attrs.email,
      pseudonyme: attrs.username,
      password: attrs.password,
      // firstName: attrs.firstName,
      // lastName: attrs.lastName,
      role: roleToString(attrs.role),
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
    }
  }
}
