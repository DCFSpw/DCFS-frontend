import { describe, expect, test } from 'vitest'

describe('test useAuth module', () => {
  test('should login user', async () => {
    const request = {data: {token: '123', email: 'john@doe.com'}}
    expect(request.data.token).eq('123')
  })
})
