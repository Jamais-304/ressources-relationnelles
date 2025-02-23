import axios, { AxiosHeaders } from 'axios'
import { Authentication } from './authentication'

/**
 * The Api class facilitates interactions with a RESTful API.
 * It handles authentication, sets up request headers, and manages HTTP
 * responses.
 */
export class Api {
  auth: Authentication
  baseUrl: string

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
    baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/',
  }: {
    auth?: Authentication
    baseUrl?: string
  } = {}) {
    this.auth = auth
    this.baseUrl = baseUrl
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
   * Sends a GET request to the specified endpoint and returns the response
   * data.
   *
   * @param {string} endpoint - The API endpoint to send the GET request to.
   * @returns {Promise<any>} A promise that resolves to the response data if the
   * request is successful.
   * @throws {Error} If the request fails or if the response status code
   * indicates an error.
   */
  async get(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        headers: this.headers,
      })
      return this.handleResponse(response)
    } catch (error: any) {
      throw new Error(`Failed to load data: ${error.response.status}`)
    }
  }

  /**
   * Processes the response from an API request and returns the response data if
   * the status code indicates success.
   *
   * @param {any} response - The response object returned by the Axios request.
   * @returns {any} The response data if the status code is in the range
   * 200-299.
   * @throws {Error} If the response status code indicates a failure.
   */
  private handleResponse(response: any): any {
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`Failed to load data: ${response.status}`)
    }
  }
}
