import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Api } from '../api'
import { UserService } from '../services/user_service'
import { Role, User } from '../models/models'

describe('UserService', () => {
  let api: Api
  let userService: UserService

  beforeEach(() => {
    api = new Api({ baseUrl: 'http://test-api' })
    userService = new UserService(api)

    // Mock axios methods
    vi.spyOn(api, 'get').mockImplementation(async (endpoint: string) => {
      switch (endpoint) {
        case 'users/get-all-users':
          return {
            data: {
              users: [
                {
                  _id: '1111',
                  email: 'test@test.com',
                  pseudonyme: 'Test',
                  role: 'utilisateur',
                },
                {
                  _id: '1112',
                  email: 'test2@test.com',
                  pseudonyme: 'Test2',
                  role: 'utilisateur',
                },
              ]
            }
          }
        case 'users/1111':
          return {
            data: {
              user: {
                _id: '1111',
                email: 'test@test.com',
                pseudonyme: 'Test',
                role: 'utilisateur',
              }
            }
          }
        default:
          return { data: {} }
      }
    })

    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        user: {
          _id: '1111',
          email: 'test@test.com',
          pseudonyme: 'Test',
          role: 'utilisateur',
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should allow to fetch a user by uuid', async () => {
    const user = await userService.get('1111')
    expect(user).toBeInstanceOf(User)
    expect(user.uuid).toBe('1111')
  })

  it('should allow list all users', async () => {
    const users = await userService.list()
    expect(users).toHaveLength(2)
    expect(users[0]).toBeInstanceOf(User)
  })

  it('should allow to create a user', async () => {
    const newUser = await userService.create({
      email: 'new@test.com',
      username: 'NewUser',
      password: 'password',
      role: Role.User,
    })
    expect(newUser).toBeInstanceOf(User)
  })
})
