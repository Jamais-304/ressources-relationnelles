import type { Api } from '../api'
import { CustomError } from '../models/custom_error'
import { Resource, type IResource, type ResourceData } from '../models/resource'
import { ContentType, type Response } from '../types/types'

export class ResourceService {
  private api: Api

  /**
   * Creates an instance of ResourceService.
   * @param api - The API client.
   */
  constructor(api: Api) {
    this.api = api
  }

  /**
   * List all resources.
   * @returns A list of instantiated Resources.
   * @throws {CustomError} When fetching resources failed.
   */
  async list(): Promise<Resource[]> {
    try {
      const response = await this.api.get(`resource`)
      console.log('🔍 DEBUG - List resources response:', response)
      
      // Essayer différents formats de réponse
      let resourcesData = null
      const responseData = response as any
      
      // Format nouveau: { data: { resources: [...] } }
      if (responseData?.data?.resources) {
        resourcesData = Array.isArray(responseData.data.resources) ? responseData.data.resources : [responseData.data.resources]
      }
      // Format nouveau: { data: { ressource: [...] } }
      else if (responseData?.data?.ressource) {
        resourcesData = Array.isArray(responseData.data.ressource) ? responseData.data.ressource : [responseData.data.ressource]
      }
      // Format ancien: { data: [...] }
      else if (responseData?.data && Array.isArray(responseData.data)) {
        resourcesData = responseData.data
      }
      // Format direct: [...]
      else if (Array.isArray(responseData)) {
        resourcesData = responseData
      }
      
      console.log('🔍 DEBUG - Parsed resourcesData:', resourcesData)
      
      if (!resourcesData) {
        console.log('⚠️ DEBUG - No resources found in response')
        return []
      }
      
      const resources = resourcesData.map((resource: ResourceData) =>
        Resource.fromJson(resource)
      )

      console.log('🔍 DEBUG - Final resources:', resources)

      return resources
    } catch (error) {
      CustomError.handleError(
        'Erreur durant la récupération d\'une liste de ressources.',
        error
      )
    }
  }

  /**
   * Get a single resource based on its id.
   * @param {object} uuid - The Resource uuid.
   * @returns A Resource.
   * @throws {CustomError} When fetching a resource failed.
   */
  async get(uuid: string): Promise<Resource> {
    try {
      const response = await this.api.get(`resource/${uuid}`)
      console.log('🔍 DEBUG - Get resource response:', response)
      
      // Essayer différents formats de réponse
      let resourceData = null
      const responseData = response as any
      
      // Format nouveau: { data: { resource: {...} } }
      if (responseData?.data?.resource) {
        resourceData = responseData.data.resource
      }
      // Format nouveau: { data: { ressource: {...} } }
      else if (responseData?.data?.ressource) {
        resourceData = responseData.data.ressource
      }
      // Format ancien: { data: {...} }
      else if (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
        resourceData = responseData.data
      }
      // Format direct: {...}
      else if (responseData && typeof responseData === 'object') {
        resourceData = responseData
      }
      
      console.log('🔍 DEBUG - Parsed resourceData:', resourceData)
      
      if (!resourceData) {
        throw new Error('No resource data found in response')
      }
      
      const resource = Resource.fromJson(resourceData as ResourceData)

      console.log('🔍 DEBUG - Final resource:', resource)

      return resource
    } catch (error) {
      CustomError.handleError(
        'Erreur durant la récupération d\'une ressource.',
        error
      )
    }
  }

  /**
   * Creates a Resource.
   *
   * @param {object} attrs - Resource attributes for registration
   * @returns {Promise<User>} A Resource object containing the created resource.
   * @throws {CustomError} When fetching a resource failed.
   */
  async create(attrs: IResource): Promise<Resource> {
    const formData = new FormData()
    const JSONattrs = Resource.toJson(attrs)

    formData.append('title', JSONattrs.title)
    formData.append('authorId', JSONattrs.authorId.toString())
    formData.append('category', JSONattrs.category)

    if (JSONattrs.file) {
      formData.append('file', JSONattrs.file)
    }

    try {
      const response = await this.api.post(`resource/create`, formData, {
        contentType: ContentType.FormData,
      })
      const resourceData = response?.data?.resource as ResourceData
      const resource = Resource.fromJson(resourceData)

      return resource
    } catch (error) {
      CustomError.handleError(
        'Erreur durant la création d\'une ressource.',
        error
      )
    }
  }

  /**
   * Updates a resource.
   *
   * @param {object} attrs - Resource attributes for update.
   * @returns {Promise<User>} A Resource object containing the created resource.
   * @throws {Error} When the resource update failed.
   */
  async update(uuid: string, attrs: IResource): Promise<Resource> {
    const formData = new FormData()
    const JSONattrs = Resource.toJson(attrs)

    formData.append('title', JSONattrs.title)
    formData.append('authorId', JSONattrs.authorId.toString())
    formData.append('category', JSONattrs.category)

    if (JSONattrs.file) {
      formData.append('file', JSONattrs.file)
    }
    try {
      const response = await this.api.put(`resource/${uuid}`, formData, {
        contentType: ContentType.FormData,
      })

      const resourceData = response?.data?.resource as ResourceData
      const resource = Resource.fromJson(resourceData)

      return resource
    } catch (error) {
      CustomError.handleError(
        'Erreur durant la mise à jour d\'une ressource.',
        error
      )
    }
  }

  /**
   * Deletes the given user account.
   *
   * @param {object} resource - Resource attributes for registration
   * @returns {Promise<Resource>} A Resource object containing the created
   * resource.
   * @throws {Error} When the resource deletion failed.
   */
  async delete(resource: Resource): Promise<Response> {
    const uuid = resource.uuid
    try {
      const response = await this.api.delete(`resource/delete/${uuid}`)
      return response
    } catch (error) {
      CustomError.handleError(
        'Erreur durant la suppression d\'une ressource.',
        error
      )
    }
  }
}
