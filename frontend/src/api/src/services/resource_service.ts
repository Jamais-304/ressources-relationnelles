import type { Api } from '../api'
import { CustomError } from '../models/custom_error'
import { Resource, type ResourceData } from '../models/resource'

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
   */
  async list(): Promise<Resource[]> {
    try {
      const response = await this.api.get(`resources/get-all-resources`)
      const resourcesData = response?.data?.resources as ResourceData[]
      const resources = resourcesData.map((resource: ResourceData) =>
        Resource.fromJson(resource)
      )
      return resources
    } catch (error) {
      CustomError.handleError(
        'Erreur durant la récupération d’une liste de ressources.',
        error
      )
    }
  }
}
