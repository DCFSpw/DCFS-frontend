import { describe, expect, it, vi } from "vitest";
import useVolumeList from "src/modules/Volume/useVolumeList.js";
import usePaginatedList from "src/modules/usePaginatedList.js";
import volumeApi from "src/api/volumeApi.js";

vi.mock("src/modules/usePaginatedList", () => ({
  default: vi.fn(() => ({
    getData: () => {},
  })),
}));

describe("test useVolumeList", () => {
  it("should get list of volumes by usePaginatedList ", async () => {
    const getData = vi.fn();
    usePaginatedList.mockImplementationOnce(() => ({
      getData,
    }));

    const { getVolumes } = useVolumeList();

    const cfg = { someCfg: "cfg" };

    await getVolumes(cfg);

    // Assert callback called
    expect(getData).toHaveBeenCalledWith(volumeApi.index, cfg);
  });
});
