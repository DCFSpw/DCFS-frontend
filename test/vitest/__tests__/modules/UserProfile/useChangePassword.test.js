import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useChangePassword from "src/modules/UserProfile/useChangePassword.js";

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useChangePassword", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("should return if form is not valid", async () => {
    const { changePassword, form, data } = useChangePassword();

    form.value = {
      validate: vi.fn(() => false),
    };

    data.value = { password: "123" };

    await changePassword();
  });

  it("should change password", async () => {
    const { changePassword, form, data } = useChangePassword();

    form.value = {
      validate: vi.fn(() => true),
      resetValidation: vi.fn(),
    };

    mock.onPut("user/password").reply(200, { success: true });

    data.value = { password: "123" };

    await changePassword();

    expect(mock.history.put.length).toBe(1);

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert data form clears
    expect(data.value).toEqual({});
  });
});
