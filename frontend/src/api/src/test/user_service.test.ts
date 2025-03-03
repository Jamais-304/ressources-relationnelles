import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from 'vitest'
import { Api } from '../api'

let api: Api
let get: MockInstance

describe('UserService', () => {
  beforeEach(() => {
    api = new Api()
    get = vi.spyOn(api, 'get')

    get.mockImplementation(async (endpoint: string) => {
      switch (endpoint) {
        case 'users':
          return [
            {
              uuid: '1111',
              email: 'test@test.com',
              username: 'Test',
              role: ['user'],
            },
            {
              uuid: '1112',
              email: 'test2@test.com',
              username: 'Test2',
              role: ['user'],
            },
          ]
        case 'users/1111':
          return {
            uuid: '1111',
            email: 'test@test.com',
            username: 'Test',
            role: ['user'],
          }
      }
    })
  })

  afterEach(() => {
    get.mockRestore()
  })

  it('should call api.get when fetching a user', async () => {
    await api.users.get('1111')
    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith('users/1111')
  })

  it('should call api.get when listing users', async () => {
    await api.users.list()
    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith('users')
  })
})
