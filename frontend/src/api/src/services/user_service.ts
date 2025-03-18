import { User, type UserData } from '../models/user'
import { Api } from '../api'

export class UserService {
  private api: Api

  /**
   * Creates an instance of UserService.
   * @param api - The API client.
   */
  constructor(api: Api) {
    this.api = api
  }

  /**
   * List all users.
   * @returns A list of instantiated Users.
   */
  async list(): Promise<User[]> {
    const response = await this.api.get(`users`)

    try {
      const usersData = response as UserData[]
      const users = usersData.map((user: UserData) => User.fromJson(user))
      return users
    } catch {
      throw new Error('Response is expected to have the form of UserData[].')
    }
  }

  /**
   * Get a user from its uuid.
   * @param uuid - A User uuid.
   * @returns A User instance.
   */
  async get(uuid: string): Promise<User> {
    const response = await this.api.get(`users/${uuid}`)

    try {
      const userData = response as UserData
      const user = User.fromJson(userData)
      return user
    } catch {
      throw new Error('Response is expected to have the form of UserData.')
    }
  }

  async create(attrs: object): Promise<User> {
    const response = await this.api.post(`users/signup`, attrs)

    try {
      const userData = response.user as UserData
      const user = User.fromJson(userData)
      return user
    } catch {
      throw new Error('Response is expected to have the form of UserData')
    }
  }
}
