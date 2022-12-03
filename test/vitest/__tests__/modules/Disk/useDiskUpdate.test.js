import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useDiskUpdate from "src/modules/Disk/useDiskUpdate.js";
import { convertGbToByte } from "src/modules/Disk/helpers.js";
import { isOauth } from "src/modules/Provider/providerType.js";

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

vi.mock("src/modules/Provider/providerType", () => ({
  isOauth: vi.fn(),
}));

vi.mock("src/modules/Disk/helpers", () => ({
  convertGbToByte: vi.fn(),
}));

const mock = new MockAdapter(apiConfig);

describe("test useDiskManage", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return false if form not valid", async () => {
    const { updateDisk, form, data, isLoading } = useDiskUpdate();
    const callback = vi.fn(() => {});
    const dataMock = { someData: "123" };
    const validateMock = vi.fn(() => false);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    expect(isLoading.value).toBe(false);

    await updateDisk(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });

  it("should update disk without credentials", async () => {
    const { updateDisk, form, data, isLoading } = useDiskUpdate();
    const callback = vi.fn(() => {});
    const diskUuid = "123";
    const dataMock = {
      uuid: diskUuid,
      someData: "123",
      provider: { type: "some-type" },
      name: "disk-name",
      totalSpace: 5,
      credentials: { login: "johny" },
    };
    const validateMock = vi.fn(() => true);

    const bytes = 12111;

    isOauth.mockImplementationOnce(() => true);
    convertGbToByte.mockImplementationOnce(() => bytes);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    mock.onPut(`/disks/manage/${diskUuid}`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await updateDisk(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    expect(convertGbToByte).toHaveBeenCalledWith(dataMock.totalSpace);

    expect(mock.history.put.length).toBe(1);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      name: dataMock.name,
      totalSpace: bytes,
    });

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert callback called
    expect(callback).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });

  it("should update disk with credentials", async () => {
    const { updateDisk, form, data, isLoading } = useDiskUpdate();
    const callback = vi.fn(() => {});
    const diskUuid = "123";
    const dataMock = {
      uuid: diskUuid,
      someData: "123",
      provider: { type: "some-type" },
      name: "disk-name",
      totalSpace: 5,
      credentials: { login: "johny" },
    };
    const validateMock = vi.fn(() => true);

    const bytes = 12111;

    isOauth.mockImplementationOnce(() => false);
    convertGbToByte.mockImplementationOnce(() => bytes);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    mock.onPut(`/disks/manage/${diskUuid}`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await updateDisk(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    expect(convertGbToByte).toHaveBeenCalledWith(dataMock.totalSpace);

    expect(mock.history.put.length).toBe(1);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      name: dataMock.name,
      totalSpace: bytes,
      credentials: dataMock.credentials,
    });

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
