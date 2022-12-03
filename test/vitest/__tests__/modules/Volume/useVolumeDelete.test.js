import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useVolumeDelete from "src/modules/Volume/useVolumeDelete.js";

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useVolumeDelete", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should delete volume, call callback and send api request", async () => {
    const { deleteVolume, isLoading } = useVolumeDelete();

    const callback = vi.fn();
    const volumeUuid = "123";

    mock
      .onDelete(`/volumes/manage/${volumeUuid}`)
      .reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await deleteVolume({ uuid: volumeUuid }, callback);

    expect(mock.history.delete.length).toBe(1);

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert callback called
    expect(callback).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });
});
