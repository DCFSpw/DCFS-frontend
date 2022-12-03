import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import IndexPage from "pages/IndexPage.vue";

describe("test IndexPage", () => {
  it("should mount IndexPage with drop  zone", async () => {
    const wrapper = shallowMount(IndexPage);
    const dropZone = wrapper.findComponent({ name: "drop-zone" });

    expect(dropZone.exists()).toBeTruthy();
  });
});
