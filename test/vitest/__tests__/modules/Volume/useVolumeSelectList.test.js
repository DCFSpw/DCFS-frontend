import { beforeEach, describe, expect, it, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import useVolumeSelectList from "src/modules/Volume/useVolumeSelectList.js";

const getVolumesMock = vi.fn(() => {});

vi.mock("src/modules/Volume/useVolumeList.js", () => ({
  default: vi.fn(() => ({
    getVolumes: getVolumesMock,
    isLoading: { value: false },
    data: { value: { pagination: { totalPages: 1 }, data: [] } },
    page: { value: 1 },
  })),
}));

const mock = new MockAdapter(apiConfig);

describe("test useVolumeSelectList", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should get volume", async () => {
    const volumeUuid = "123";
    const volumeResponse = { uuid: volumeUuid, name: "some-volume" };

    mock
      .onGet(`/volumes/manage/${volumeUuid}`)
      .reply(200, { success: true, data: volumeResponse });

    const { getVolume } = useVolumeSelectList();

    const response = await getVolume(volumeUuid);

    // Assert api called
    expect(mock.history.get.length).toBe(1);

    // Assert response
    expect(response).toEqual(volumeResponse);
  });

  it("should initially load volumes", async () => {
    const { initialLoadVolumes, page } = useVolumeSelectList();

    await initialLoadVolumes();

    // Assert getVolumes called
    expect(getVolumesMock).toHaveBeenCalled();

    // Assert page is 1
    expect(page.value).toBe(2);
  });

  it("should load volumes", async () => {
    const { loadVolumes, page } = useVolumeSelectList();

    await loadVolumes();

    // Assert getVolumes called
    expect(getVolumesMock).toHaveBeenCalled();

    // Assert page is 1
    expect(page.value).toBe(1);
  });
});
