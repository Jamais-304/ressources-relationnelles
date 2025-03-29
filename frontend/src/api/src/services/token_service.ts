import { Token, type TokenData } from '../models/models'
import { Api } from '../api'
import { setToken } from '@/utils/cookies'

export class TokenService {
  private api: Api

  /**
   * Creates an instance of UserService.
   * @param api - The API client.
   */
  constructor(api: Api) {
    this.api = api
  }

  /**
   * Refreshes the access token.
   * @param refreshToken - The refresh token.
   * @returns a Token.
   */
  async refresh(refreshToken: string): Promise<Token> {
    this.api.disableTokenHandling()

    try {
      const response = await this.api.post(`users/refresh-token`, {
        refreshToken,
      })

      const tokenData = response.tokens as TokenData
      const userToken = Token.fromJson(tokenData)

      setToken('accessToken', userToken.access)
      setToken('tokenExpiryTime', (Date.now() + 14 * 60 * 1000).toString())

      return userToken
    } catch {
      throw new Error('Response is expected to have the form of TokenData.')
    } finally {
      this.api.enableTokenHandling()
    }
  }
}
