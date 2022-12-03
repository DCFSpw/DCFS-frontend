import { describe, expect, it } from "vitest";
import ErrorNotFound from "pages/ErrorNotFound.vue";
import { shallowMount } from "@vue/test-utils";

describe("test ErrorNotFound", () => {
  it("should show not found text", async () => {
    const wrapper = shallowMount(ErrorNotFound);
    expect(wrapper.text()).toMatch("Oops. Nothing here...");
  });
});
