export class Authentication {
  readonly bearerToken?: string

  /**
   * Creates an Authentication instance that uses the specified bearerToken.
   * @param {string | null} bearerToken The user's bearer token.
   */
  private constructor(bearerToken?: string) {
    this.bearerToken = bearerToken
  }

  /**
   * Creates an Authentication instance that uses the specified bearerToken.
   * @param {string} bearerToken The user's bearer token.
   */
  static bearerToken(bearerToken: string): Authentication {
    return new Authentication(bearerToken)
  }

  /**
   * Creates an Authentication instance that has no authentication.
   */
  static anonymous(): Authentication {
    return new Authentication()
  }

  /**
   * Anonymous Authentication Flag
   */
  get isAnonymous(): boolean {
    return !this.isBearer
  }

  /**
   * Anonymous Authentication Flag
   */
  get isBearer(): boolean {
    return this.bearerToken !== undefined
  }

  /**
   * Returns a value for the `Authorization` HTTP request header or `null`
   * if isAnonymous is true.
   */
  authorizationHeaderValue(): string | null {
    if (this.isBearer) {
      return `Bearer ${this.bearerToken}`
    }
    return null
  }
}
