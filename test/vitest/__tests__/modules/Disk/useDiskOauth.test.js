import MockAdapter from "axios-mock-adapter";
import { describe, expect, it, vi, afterAll, beforeEach } from "vitest";
import apiConfig from "src/api/apiConfig.js";
import { useRoute, useRouter } from "vue-router";
import useDiskOauth from "src/modules/Disk/useDiskOauth.js";
import { DISK_CREATION_UID_KEY } from "src/modules/Disk/Const/DiskConst.js";

const codeMock = 123456789;

vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => ({
    push: () => {},
  })),
  useRoute: vi.fn(() => ({
    query: { code: codeMock },
  })),
}));

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useDiskOauth", () => {
  afterAll(() => {
    mock.restore();
  });

  beforeEach(() => {
    mock.reset();
  });

  it("should show notification when query code is null", async () => {
    const push = vi.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));

    useRoute.mockImplementationOnce(() => ({
      query: { code: null },
    }));

    const { checkOauth } = useDiskOauth();

    await checkOauth();

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(
        expect.objectContaining({
          type: "negative",
          message: "Oauth code not found.",
        })
      );

    // Assert route pushed
    expect(push)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ name: "disks" }));
  });

  it("should show notification when disk uuid is not in localstorage", async () => {
    const push = vi.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));

    const { checkOauth } = useDiskOauth();

    await checkOauth();

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(
        expect.objectContaining({
          type: "negative",
          message: "Disk uuid not found in local storage.",
        })
      );

    // Assert route pushed
    expect(push)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ name: "disks" }));
  });

  it("should send api request when everything is present", async () => {
    const diskUuid = "123";
    localStorage.setItem(DISK_CREATION_UID_KEY, diskUuid);

    const push = vi.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));

    const { checkOauth } = useDiskOauth();

    mock.onPost(`/disks/oauth/${diskUuid}`).reply(200, { success: true });

    await checkOauth();

    // Assert disk uuid removed from local storage
    expect(localStorage.removeItem).toHaveBeenCalledWith(DISK_CREATION_UID_KEY);

    // Assert good data send to api
    expect(mock.history.post.length).toBe(1);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      diskUuid,
      code: codeMock,
    });

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(
        expect.objectContaining({
          type: "positive",
        })
      );

    // Assert route pushed
    expect(push)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ name: "disks" }));
  });
});
