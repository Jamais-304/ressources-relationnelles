import axios, { AxiosHeaders, type AxiosResponse } from 'axios'
import { Authentication } from './authentication'
import { UserService, TokenService } from './services/services'
import { type Response } from './types/response'
import { getToken } from '@/utils/cookies'
/**
 * The Api class facilitates interactions with a RESTful API.
 * It handles authentication, sets up request headers, and manages HTTP
 * responses.
 */
export class Api {
  auth: Authentication
  baseUrl: string
  private isRefreshing = false
  private tokenService?: TokenService
  private userService?: UserService

  /**
   * Constructs an instance of the Api class.
   *
   * @param {Object} params - The parameters for the Api instance.
   * @param {Authentication} [params.auth] - An instance of Authentication to
   * handle authentication for API requests. Defaults to anonymous
   * authentication.
   * @param {string} params.baseUrl - The base URL for the API. Defaults to the
   * value of the API_BASE_URL environment variable or 'http://localhost:3000/'
   * if the environment variable is not set.
   */
  constructor({
    auth = Authentication.anonymous(),
    baseUrl = import.meta.env.VITE_API_BASE_URL,
  }: {
    auth?: Authentication
    baseUrl?: string
  } = {}) {
    this.auth = auth
    this.baseUrl = baseUrl
  }

  /**
   * Gets or creates a TokenService instance.
   * Implements lazy initialization of the TokenService.
   *
   * @returns {TokenService} The TokenService instance
   */
  get token(): TokenService {
    if (!this.tokenService) {
      this.tokenService = new TokenService(this)
    }
    return this.tokenService
  }

  /**
   * Gets the UserService instance associated with this Api instance.
   *
   * This getter implements lazy initialization for the UserService. The first
   * time it is accessed, it initializes the `userService` property with a new
   * instance of UserService. Subsequent accesses return the already-initialized
   * instance.
   *
   * @returns {UserService} The UserService instance associated with this Api
   * instance.
   *
   * @remarks
   * This pattern ensures that the UserService is only created when it is first
   * needed, which can improve performance and resource management by avoiding
   * unnecessary object creation.
   */
  get users(): UserService {
    if (!this.userService) {
      this.userService = new UserService(this)
    }
    return this.userService
  }

  /**
   * Gets the headers to be used in API requests.
   *
   * @returns {AxiosHeaders} The headers for API requests,
   * including Content-Type and Authorization if bearer token authentication
   * is used.
   */
  get headers(): AxiosHeaders {
    const headers: AxiosHeaders = new AxiosHeaders()
    headers.set('Content-Type', 'application/json')

    if (this.auth.isBearer) {
      headers.set('Authorization', `Bearer ${this.auth.bearerToken}`)
    }

    return headers
  }

  /**
   * Manages token refresh logic before API requests.
   *
   * Checks if access token is expired or close to expiring (within 1 minute buffer).
   * If needed, refreshes the token using the refresh token. Updates authentication
   * with new tokens.
   */
  private async handleTokens(): Promise<void> {
    if (this.isRefreshing) {
      return
    }

    const accessToken = getToken('accessToken')
    const refreshToken = getToken('refreshToken')

    if (!accessToken || !refreshToken) {
      return
    }

    const tokenExpiryTime = parseInt(getToken('tokenExpiryTime') || '0', 10)
    const bufferTime = 60 * 1000 // 1 minute buffer
    const isTokenExpired = Date.now() >= tokenExpiryTime - bufferTime

    if (isTokenExpired) {
      this.isRefreshing = true
      try {
        const newToken = await this.token.refresh(refreshToken)
        this.auth = Authentication.bearerToken(newToken.access)
      } finally {
        this.isRefreshing = false
      }
    } else {
      this.auth = Authentication.bearerToken(accessToken)
    }
  }

  /**
   * Sends a GET request to the specified endpoint and returns the response
   * data.
   *
   * @param {string} endpoint - The API endpoint to send the GET request to.
   * @returns {Promise<unknown>} A promise that resolves to the response data if the
   * request is successful.
   * @throws {Error} If the request fails or if the response status code
   * indicates an error.
   */
  async get(endpoint: string): Promise<unknown> {
    await this.handleTokens()

    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        headers: this.headers,
      })
      return this.handleResponse(response)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to load data: ${error.response?.status}`)
      } else {
        throw new Error(`Failed to load data: ${error}`)
      }
    }
  }

  /**
   * Sends a POST request to the specified API endpoint.
   *
   * @param {string} endpoint - The API endpoint to send the request to
   * @param {object} body - The data to send in the request body
   * @returns {Promise<Response>} The parsed response data
   * @throws {Error} When the request fails or returns an error status
   */
  async post(endpoint: string, body: object): Promise<Response> {
    await this.handleTokens()

    try {
      const response = await axios.post(`${this.baseUrl}/${endpoint}`, body,
        { headers: this.headers }
      )
      return this.handleResponse(response)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to send data: ${error.response?.status}`)
      } else {
        throw new Error(`Failed to send data: ${error}`)
      }
    }
  }

  /**
   * Processes the response from an API request and returns the response data if
   * the status code indicates success.
   *
   * @param {AxiosResponse} response - The response object returned by the Axios request.
   * @returns {unknown} The response data if the status code is in the range
   * 200-299.
   * @throws {Error} If the response status code indicates a failure.
   */
  private handleResponse(response: AxiosResponse): Response {
    if (response.status >= 200 && response.status < 300) {
      return response.data.data
    } else {
      throw new Error(`Failed to load data: ${response.status}`)
    }
  }
}
