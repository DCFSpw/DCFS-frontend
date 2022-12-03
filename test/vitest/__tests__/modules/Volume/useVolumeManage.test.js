import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useVolumeManage from "src/modules/Volume/useVolumeManage.js";

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useVolumeManage", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return false if form not valid", async () => {
    const { createVolume, form, data, isLoading } = useVolumeManage();
    const callback = vi.fn(() => {});
    const dataMock = { someData: "123" };
    const validateMock = vi.fn(() => false);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    expect(isLoading.value).toBe(false);

    await createVolume(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });

  it("should create volume", async () => {
    const { createVolume, form, data, isLoading } = useVolumeManage();
    const callback = vi.fn(() => {});
    const dataMock = { someData: "123" };
    const validateMock = vi.fn(() => true);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    mock.onPost(`/volumes/manage`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await createVolume(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    expect(mock.history.post.length).toBe(1);
    expect(JSON.parse(mock.history.post[0].data)).toEqual(dataMock);

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert callback called
    expect(callback).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });

  it("should update volume", async () => {
    const { updateVolume, form, data, isLoading } = useVolumeManage();
    const callback = vi.fn(() => {});
    const volumeUuid = "123";
    const dataMock = { uuid: volumeUuid, someData: "123" };
    const validateMock = vi.fn(() => true);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    mock.onPut(`/volumes/manage/${volumeUuid}`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await updateVolume(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    expect(mock.history.put.length).toBe(1);
    expect(JSON.parse(mock.history.put[0].data)).toEqual(dataMock);

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
