import { expect, it, vi, describe } from "vitest";
import { useRouter } from "vue-router";
import useUserSession from "src/modules/useUserSession.js";
import useLogout from "src/modules/Auth/useLogout.js";

vi.mock("src/modules/useUserSession", () => ({
  default: vi.fn(() => ({ token: "", user: {} })),
}));

vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => ({
    push: () => {},
  })),
}));

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

describe("test useLogout", () => {
  it("should logout user", async () => {
    const push = vi.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));

    let session = { token: "SOME_RANDOM_TOKEN", user: { name: "Johny" } };
    useUserSession.mockImplementationOnce(() => session);

    const { logout } = useLogout();

    await logout();

    // Assert user data cleared
    expect(session.token).toEqual("");
    expect(session.user).toEqual({});

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert route pushed
    expect(push)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ name: "login" }));
  });
});
