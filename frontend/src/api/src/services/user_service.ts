import { User, type UserData, type TokenData } from '../models/models'
import { Api } from '../api'
import { Token } from '../models/token'
import { setToken } from '@/utils/cookies'
import type { Response } from '../types/response'
import type { IUser } from '../models/user'
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
   * Authenticates a user and stores their tokens in cookies.
   *
   * @param {object} attrs - User credentials for authentication
   * @returns {Promise<Token>} A Token object with access and refresh attrs.
   * @throws {Error} When the API response doesn't match the TokenData format.
   */
  async login(attrs: object): Promise<User> {
    this.api.disableTokenHandling()

    try {
      const response = await this.api.post(`users/login`, attrs)

      const tokenData = response?.data?.tokens as TokenData
      const userToken = Token.fromJson(tokenData)

      setToken('accessToken', userToken.access)
      userToken.refresh && setToken('refreshToken', userToken.refresh)
      setToken('tokenExpiryTime', (Date.now() + 14 * 60 * 1000).toString())

      const userData = response?.data?.user as UserData
      const user = User.fromJson(userData)

      // NOTE: A non-admin user instance for dev purposes.
      // const user = new User({
      //   uuid: 'aiuenettn',
      //   username: 'Guillaume',
      //   email: 'test@test.com',
      //   role: ['user'],
      // })

      return user
    } catch (error) {
      throw new Error(
        `Response is expected to have the form of UserData. Error: ${error}`
      )
    } finally {
      this.api.enableTokenHandling()
    }
  }

  /**
   * List all users.
   * @returns A list of instantiated Users.
   */
  async list(): Promise<User[]> {
    try {
      const response = await this.api.get(`users/get-all-users`)
      const usersData = response?.data?.users as UserData[]
      const users = usersData.map((user: UserData) => User.fromJson(user))
      return users
    } catch (error) {
      throw new Error(
        `Response is expected to have the form of UserData[]. Error: ${error}`
      )
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
      const userData = response?.data?.user as UserData
      const user = User.fromJson(userData)
      return user
    } catch {
      throw new Error('Response is expected to have the form of UserData.')
    }
  }

  /**
   * Creates a new user account.
   *
   * @param {object} attrs - User attributes for registration
   * @returns {Promise<User>} A User object containing the created user.
   * @throws {Error} When the API response doesn't match UserData format.
   */
  async create(attrs: IUser): Promise<User> {
    const JSONattrs = User.toJson(attrs)
    try {
      const response = await this.api.post(`users/create-user`, JSONattrs)

      const tokenData = response?.data?.tokens as TokenData
      const userToken = Token.fromJson(tokenData)

      setToken('accessToken', userToken.access)
      userToken.refresh && setToken('refreshToken', userToken.refresh)
      setToken('tokenExpiryTime', (Date.now() + 14 * 60 * 1000).toString())

      const userData = response?.data?.user as UserData
      const user = User.fromJson(userData)

      return user
    } catch (error) {
      throw new Error(
        `Response is expected to have the form of UserData. Error: ${error}`
      )
    }
  }

  /**
   * Creates a user account.
   *
   * @param {object} attrs - User attributes for registration
   * @returns {Promise<User>} A User object containing the created user.
   * @throws {Error} When the API response doesn't match UserData format.
   */
  async update(uuid: string, attrs: IUser): Promise<User> {
    const JSONattrs = User.toJson(attrs)
    try {
      const response = await this.api.put(
        `users/update-user/${uuid}`,
        JSONattrs
      )

      const userData = response?.data?.user as UserData
      const user = User.fromJson(userData)

      return user
    } catch (error) {
      throw new Error(
        `Response is expected to have the form of UserData. Error: ${error}`
      )
    }
  }

  /**
   * Deletes the given user account.
   *
   * @param {object} user - User attributes for registration
   * @returns {Promise<User>} A User object containing the created user.
   * @throws {Error} When the API response doesn't match UserData format.
   */
  async delete(user: User): Promise<Response> {
    const uuid = user.uuid
    try {
      const response = await this.api.delete(`users/delete-user/${uuid}`)
      return response
    } catch (error) {
      throw new Error(
        `Response is expected to have the form of UserData. Error: ${error}`
      )
    }
  }
}
