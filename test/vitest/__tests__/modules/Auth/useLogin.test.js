import useLogin from "src/modules/Auth/useLogin.js";
import MockAdapter from "axios-mock-adapter";
import { describe, expect, it, vi, afterAll, beforeEach } from 'vitest';
import apiConfig from "src/api/apiConfig.js";
import Quasar from "quasar";

vi.mock("src/modules/useUserSession", () => ({
  default: () => ({token: '', user: {}, isLoggedIn: () => {}})
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('quasar', () => ({
  default: {
    Notify: {
      create: vi.fn()
    }
  }
}))

const mock = new MockAdapter(apiConfig)

describe('test useLogin', () => {
  afterAll(() => {
    mock.restore()
  })

  beforeEach(() => {
    mock.reset()
  })

  it('should login user', async () => {

    mock
      .onPost('auth/login')
      .reply(200, {success: true, data: {XDDD: 1}})


    const { login } = useLogin();

    await login()

    expect(Quasar.Notify.create)
      .toBeCalledTimes(1)
      .toHaveBeenCalledWith(expect.objectContaining({type: 'positive'}))
  })
})
