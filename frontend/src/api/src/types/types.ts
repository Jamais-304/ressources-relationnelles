import type { InternalAxiosRequestConfig } from 'axios'
export { type Response } from './response'

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
}

export interface CustomRequestConfig extends InternalAxiosRequestConfig {
  contentType?: ContentType
}
