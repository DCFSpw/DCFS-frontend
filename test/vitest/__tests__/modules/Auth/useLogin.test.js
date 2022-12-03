import useLogin from "src/modules/Auth/useLogin.js";
import MockAdapter from "axios-mock-adapter";
import { describe, expect, it, vi, afterAll, beforeEach } from "vitest";
import apiConfig from "src/api/apiConfig.js";
import { useRouter } from "vue-router";
import useUserSession from "src/modules/useUserSession.js";
import useNotification from "src/modules/useNotification.js";

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

const mock = new MockAdapter(apiConfig);

describe("test useLogin", () => {
  afterAll(() => {
    mock.restore();
  });

  beforeEach(() => {
    mock.reset();
  });

  it("should login user", async () => {
    const push = vi.fn();
    useRouter.mockImplementationOnce(() => ({
      push,
    }));

    let session = { token: "", user: {} };
    useUserSession.mockImplementationOnce(() => session);

    const token = 123;
    const user = { token, name: "John" };

    mock.onPost("auth/login").reply(200, { success: true, data: user });

    const { login } = useLogin();

    await login();

    // Assert user data set
    expect(session.token).toEqual(token);
    expect(session.user).toEqual(user);

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert route pushed
    expect(push)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ name: "dashboard" }));

    // Assert good data send to api
    expect(mock.history.post.length).toBe(1);
    expect(JSON.parse(mock.history.post[0].data)).toContainKeys([
      "email",
      "password",
    ]);
  });
});
