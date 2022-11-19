import MockAdapter from "axios-mock-adapter";
import { describe, expect, it, vi, afterAll, beforeEach } from 'vitest';
import apiConfig from "src/api/apiConfig.js";
import Quasar from "quasar";
import {useRouter} from "vue-router";
import useRegister from "src/modules/Auth/useRegister.js";

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: () => {},
  })),
}));

vi.mock('quasar', () => ({
  default: {
    Notify: {
      create: vi.fn()
    }
  }
}))

const mock = new MockAdapter(apiConfig)

describe('test useRegister', () => {
  afterAll(() => {
    mock.restore()
  })

  beforeEach(() => {
    mock.reset()
  })

  it('should register user', async () => {
    const push = vi.fn()
    useRouter.mockImplementationOnce(() => ({
      push
    }))

    mock
      .onPost('auth/register')
      .reply(200, {success: true})

    const { register } = useRegister();

    await register()

    // Assert notification sent
    expect(Quasar.Notify.create)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({type: 'positive'}))

    // Assert route pushed
    expect(push)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({name: 'login'}))

    // Assert good data send to api
    expect(mock.history.post.length).toBe(1)
    expect(JSON.parse(mock.history.post[0].data))
      .toContainKeys(['email', 'password', 'passwordRepeat', 'firstName', 'lastName'])
  })
})
