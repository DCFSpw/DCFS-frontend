import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import {beforeEach, describe, expect, it, vi} from "vitest";
import useProfileInfo from "src/modules/UserProfile/useProfileInfo.js";
import useUserSession from "src/modules/useUserSession.js";
import Quasar from "quasar";

vi.mock("src/modules/useUserSession", () => ({
  default: vi.fn(() => ({token: '', user: {}}))
}))

vi.mock('quasar', () => ({
  default: {
    Notify: {
      create: vi.fn()
    }
  }
}))

const mock = new MockAdapter(apiConfig)

describe('test useProfileInfo', () => {
  const userData = {firstName: 'John', lastName: 'Doe'}

  beforeEach(() => {
    mock.reset()
  })

  it('should get user profile info', async () => {
    const { getProfile, data } = useProfileInfo()

    mock
      .onGet('user/profile')
      .reply(200, {success: true, data: userData})

    await getProfile()

    expect(mock.history.get.length).toBe(1)

    expect(data.value).toEqual(userData)
  })

  it('should update user profile', async () => {
    let session = {token: '', user: {}}
    useUserSession.mockImplementationOnce(() => session)

    const { updateProfile, data, form } = useProfileInfo()

    form.value = { validate: vi.fn(() => true) }

    mock
      .onPut('user/profile')
      .reply(200, {success: true})

    data.value = userData

    await updateProfile()

    expect(mock.history.put.length).toBe(1)

    // Assert notification sent
    expect(Quasar.Notify.create)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({type: 'positive'}))

    // Assert session updated
    expect(session.user.firstName).toEqual(userData.firstName)
    expect(session.user.lastName).toEqual(userData.lastName)
  })
})
