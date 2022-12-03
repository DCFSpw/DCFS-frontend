import { describe, expect, it } from "vitest";
import useUserSession from "src/modules/useUserSession.js";

describe("test useUserSession", () => {
  it("should return correct data", async () => {
    const userSession = useUserSession();

    expect(userSession).toContainKeys(["token", "user", "isLoggedIn"]);
  });

  it("test should return loggedIn - true if user has saved token", async () => {
    const userSession = useUserSession();
    userSession.token = "some-random-token";

    expect(userSession.isLoggedIn).toBeTruthy();
  });

  it("test should return loggedIn - false if user has empty token", async () => {
    const userSession = useUserSession();
    userSession.token = "";

    expect(userSession.isLoggedIn).toBeFalsy();
  });
});
