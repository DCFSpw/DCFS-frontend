import {describe, expect, it, beforeEach} from "vitest";
import useProvider from "src/modules/Provider/useProvider.js";
import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";

const mock = new MockAdapter(apiConfig)

describe('test useProvider', () => {

  beforeEach(() => {
    const { providers } = useProvider()
    providers.value = []

    mock.reset()
  })

  it('should not call api when providers not empty', async () => {
    const { getProviders, providers } = useProvider()
    providers.value = ['someData']

    mock
      .onGet('providers')
      .reply(200, {success: true})

    await getProviders()

    expect(mock.history.get.length).toBe(0)
  })

  it('should should call api', async () => {
    const { getProviders, providers } = useProvider()

    const fakeProviders = ['provider1', 'provider2']

    mock
      .onGet('/providers')
      .reply(200, { success: true, data: fakeProviders })

    await getProviders()

    expect(mock.history.get.length).toBe(1)

    expect(providers.value).toEqual(fakeProviders)
  })
})
