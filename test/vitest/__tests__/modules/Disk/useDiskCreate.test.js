import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useDiskCreate from "src/modules/Disk/useDiskCreate.js";
import { convertGbToByte } from "src/modules/Disk/helpers.js";
import { isOauth } from "src/modules/Provider/providerType.js";
import { DISK_CREATION_UID_KEY } from "src/modules/Disk/Const/DiskConst.js";

vi.mock("src/modules/Provider/providerType", () => ({
  isOauth: vi.fn(),
}));

vi.mock("src/modules/Disk/helpers", () => ({
  convertGbToByte: vi.fn(),
}));

const mock = new MockAdapter(apiConfig);

describe("test useDiskCreate", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return false if form not valid", async () => {
    const { createDisk, form, data, isLoading } = useDiskCreate();
    const callback = vi.fn(() => {});
    const dataMock = { someData: "123" };
    const validateMock = vi.fn(() => false);

    form.value = {
      validate: validateMock,
    };
    data.value = dataMock;

    expect(isLoading.value).toBe(false);

    await createDisk(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });

  it("should create disk without oauth", async () => {
    const { createDisk, form, data, isLoading } = useDiskCreate();
    const callback = vi.fn(() => {});
    const diskUuid = "123";
    const providerUuid = "321";
    const volumeUuid = "132";

    const dataMock = {
      uuid: diskUuid,
      provider: { uuid: providerUuid, type: "some-type" },
      volume: { uuid: volumeUuid },
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

    mock.onPost(`/disks/manage`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await createDisk(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    expect(convertGbToByte).toHaveBeenCalledWith(dataMock.totalSpace);

    expect(mock.history.post.length).toBe(1);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      name: dataMock.name,
      totalSpace: bytes,
      providerUUID: providerUuid,
      volumeUUID: volumeUuid,
      credentials: dataMock.credentials,
    });

    // Assert callback called
    expect(callback).toHaveBeenCalledWith({ toLastPage: true });

    // Assert credentials cleared
    expect(data.value.credentials).toEqual({});

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });

  it("should create disk with oauth", async () => {
    const locationReplaceMock = vi.fn(() => {});

    Object.defineProperty(window, "location", {
      writable: true,
      value: { replace: locationReplaceMock },
    });

    const { createDisk, form, data, isLoading } = useDiskCreate();
    const callback = vi.fn(() => {});
    const diskUuid = "123";
    const providerUuid = "321";
    const volumeUuid = "132";

    const dataMock = {
      uuid: diskUuid,
      provider: { uuid: providerUuid, type: "some-type" },
      volume: { uuid: volumeUuid },
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

    const returnedDiskUuid = "333";
    const returnedLink = "http://some-url.com";
    mock.onPost(`/disks/manage`).reply(200, {
      success: true,
      data: { disk: { uuid: returnedDiskUuid }, link: returnedLink },
    });

    expect(isLoading.value).toBe(false);

    await createDisk(callback);

    // Assert form validation checked
    expect(validateMock).toHaveBeenCalled();

    expect(convertGbToByte).toHaveBeenCalledWith(dataMock.totalSpace);

    expect(mock.history.post.length).toBe(1);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      name: dataMock.name,
      totalSpace: bytes,
      providerUUID: providerUuid,
      volumeUUID: volumeUuid,
      credentials: {},
    });

    // Assert local storage set
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      DISK_CREATION_UID_KEY,
      returnedDiskUuid
    );

    // Assert location changed
    expect(locationReplaceMock).toHaveBeenCalledWith(returnedLink);

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });
});
