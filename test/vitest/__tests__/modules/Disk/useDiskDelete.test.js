import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Quasar from "quasar";
import useDiskDelete from "src/modules/Disk/useDiskDelete.js";

vi.mock("quasar", () => ({
  default: {
    Notify: {
      create: vi.fn(),
    },
  },
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
    expect(Quasar.Notify.create)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert callback called
    expect(callback).toHaveBeenCalled();

    // Assert loading is false
    expect(isLoading.value).toBe(false);
  });
});
