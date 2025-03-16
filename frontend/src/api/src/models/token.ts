export interface TokenData {
  accesToken: string
  refreshToken: string
}

export interface Token {
  access: string
  refresh: string
}

export class Token {
  access: string
  refresh: string

  /**
   * Creates an instance of Token.
   * @param data - The data to initialize the User instance.
   */
  constructor(data: TokenData) {
    this.access = data.accesToken
    this.refresh = data.refreshToken
  }

  /**
   * Creates a Token instance from a JSON object.
   * @param data - The JSON object to create the Token instance from.
   * @returns A new Token instance.
   */
  static fromJson(data: TokenData): Token {
    const token = new Token(data)
    return token
  }

  /**
   * Converts the User instance to a JSON object.
   * @returns A JSON object representing the User instance.
   */
  toJson(): TokenData {
    return {
      accesToken: this.access,
      refreshToken: this.refresh,
    }
  }
}
