export enum RelationType {
  Colleagues = 'colleague',
  Family = 'family',
  Friends = 'friends',
  Love = 'love',
}

/**
 * Converts a string relation type to a RelationType enum value.
 * @param relationType - The string relation type to convert.
 * @returns The corresponding RelationType enum value.
 * @throws An error if the relation type is not recognized.
 */
export function relationTypeFromString(
  relationType: string | undefined
): RelationType {
  switch (relationType) {
    case 'colleague':
      return RelationType.Colleagues
    case 'family':
      return RelationType.Family
    case 'friends':
      return RelationType.Friends
    case 'love':
      return RelationType.Love
    default:
      throw new Error(`Unrecognized relation type: ${relationType}`)
  }
}

/**
 * Converts a RelationType enum value to its string representation.
 * @param relationType - The RelationType enum value to convert.
 * @returns The corresponding string relation type.
 */
export function relationTypeToString(
  relationType: RelationType | undefined
): string | undefined {
  if (!relationType) {
    return undefined
  }

  switch (relationType) {
    case RelationType.Colleagues:
      return 'colleague'
    case RelationType.Family:
      return 'family'
    case RelationType.Friends:
      return 'friends'
    case RelationType.Love:
      return 'love'
    default:
      throw new Error(`Unrecognized relation type: ${relationType}`)
  }
}
