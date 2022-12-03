import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useProfileInfo from "src/modules/UserProfile/useProfileInfo.js";
import useUserSession from "src/modules/useUserSession.js";

vi.mock("src/modules/useUserSession", () => ({
  default: vi.fn(() => ({ token: "", user: {} })),
}));

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useProfileInfo", () => {
  const userData = { firstName: "John", lastName: "Doe" };

  beforeEach(() => {
    mock.reset();
  });

  it("should get user profile info", async () => {
    const { getProfile, data } = useProfileInfo();

    mock.onGet("user/profile").reply(200, { success: true, data: userData });

    await getProfile();

    expect(mock.history.get.length).toBe(1);

    expect(data.value).toEqual(userData);
  });

  it("should return true if data changed", async () => {
    const { dataChanged, data, originalData } = useProfileInfo();

    originalData.value = { name: "John" };
    data.value = { name: "Joe" };

    expect(dataChanged.value).toBe(true);
  });

  it("should return false if data not changed", async () => {
    const { dataChanged, data, originalData } = useProfileInfo();

    originalData.value = { name: "John" };
    data.value = originalData.value;

    expect(dataChanged.value).toBe(false);
  });

  it("should return if form is not valid", async () => {
    const { updateProfile, form } = useProfileInfo();

    form.value = { validate: vi.fn(() => false) };

    await updateProfile();
  });

  it("should update user profile", async () => {
    let session = { token: "", user: {} };
    useUserSession.mockImplementationOnce(() => session);

    const { updateProfile, data, form } = useProfileInfo();

    form.value = { validate: vi.fn(() => true) };

    mock.onPut("user/profile").reply(200, { success: true });

    data.value = userData;

    await updateProfile();

    expect(mock.history.put.length).toBe(1);

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));

    // Assert session updated
    expect(session.user.firstName).toEqual(userData.firstName);
    expect(session.user.lastName).toEqual(userData.lastName);
  });
});
