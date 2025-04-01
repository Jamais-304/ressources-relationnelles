import { Role } from '@/api/api'

export const roles = [
  {
    title: 'Utilisateur',
    value: Role.User,
  },
  {
    title: 'Modérateur',
    value: Role.Moderator,
  },
  {
    title: 'Administrateur',
    value: Role.Admin,
  },
  {
    title: 'Super-Administrateur',
    value: Role.SuperAdmin,
  },
]
