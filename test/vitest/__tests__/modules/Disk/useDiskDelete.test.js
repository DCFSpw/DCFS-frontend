import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useDiskDelete from "src/modules/Disk/useDiskDelete.js";

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useDiskDelete", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should delete disk, call callback and send api request", async () => {
    const { deleteDisk, isLoading } = useDiskDelete();

    const callback = vi.fn();
    const diskUuid = "123";

    mock.onDelete(`/disks/manage/${diskUuid}`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await deleteDisk({ uuid: diskUuid }, callback);

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

  it("should replace disk, call callback and send api request", async () => {
    const { replaceDisk, isLoading } = useDiskDelete();

    const callback = vi.fn();
    const diskUuid = "123";

    mock.onDelete(`/disks/backup/${diskUuid}`).reply(200, { success: true });

    expect(isLoading.value).toBe(false);

    await replaceDisk({ uuid: diskUuid }, callback);

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
