import {
  relationTypeFromString,
  relationTypeToString,
  type RelationType,
} from './relationType'

export interface ResourceData {
  _id?: string
  title: string
  authorId: string
  file?: File
  contentGridfsId?: string
  category: string
  // relationType?: string
  status: string
  validatedAndPublishedAt?: string
  validatedBy?: number
  createdAt?: string
  updatedAt?: string
}

export interface IResource {
  uuid?: string
  title: string
  authorUuid: string
  file?: File
  contentGridfsUuid?: string
  // relationType?: RelationType
  category: string
  status: string
  validatedAndPublishedAt?: string
  validatedBy?: number
  createdAt?: string
  updatedAt?: string
}

export class Resource implements IResource {
  uuid?: string
  title: string
  authorUuid: string
  file?: File
  contentGridfsUuid?: string
  relationType?: RelationType
  category: string
  status: string
  validatedAndPublishedAt?: string
  validatedBy?: number
  createdAt?: string
  updatedAt?: string

  /**
   * Creates an instance of Resource.
   * @param data - The data to initialize the Resource instance.
   */
  constructor(data: ResourceData) {
    this.uuid = data._id
    this.title = data.title
    this.authorUuid = data.authorId
    this.contentGridfsUuid = data.contentGridfsId
    // this.relationType = relationTypeFromString(data.relationType)
    this.category = data.category
    this.status = data.status
    this.validatedAndPublishedAt = data.validatedAndPublishedAt
    this.validatedBy = data.validatedBy
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  /**
   * Creates a Resource instance from a JSON object.
   * @param data - The JSON object to create the Resource instance from.
   * @returns A new Resource instance.
   */
  static fromJson(data: ResourceData): Resource {
    return new Resource(data)
  }

  /**
   * Converts the Resource instance to a JSON object.
   * @returns A JSON object representing the Resource instance.
   */
  static toJson(attrs: IResource): ResourceData {
    return {
      _id: attrs.uuid,
      title: attrs.title,
      authorId: attrs.authorUuid,
      // resourceMIMEtype:
      file: attrs.file,
      contentGridfsId: attrs.contentGridfsUuid,
      category: attrs.category,
      // relationType: relationTypeToString(attrs.relationType),
      status: attrs.status,
      validatedAndPublishedAt: attrs.validatedAndPublishedAt,
      validatedBy: attrs.validatedBy,
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
    }
  }
}
