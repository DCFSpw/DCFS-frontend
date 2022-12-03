import {describe, expect, it, vi} from "vitest";
import usePaginatedList from "src/modules/usePaginatedList.js";
import useDiskList from "src/modules/Disk/useDiskList.js";
import diskApi from "src/api/diskApi.js";

vi.mock('src/modules/usePaginatedList', () => ({
  default: vi.fn(() => ({
    getData: () => {}
  }))
}))

describe('test useDiskList', () => {
  it('should get list of volumes by usePaginatedList ', async () => {
    const getData = vi.fn()
    usePaginatedList.mockImplementationOnce(() => ({
      getData
    }))

    const { getDisks } = useDiskList()

    const cfg = { someCfg: 'cfg' }

    await getDisks(cfg)

    // Assert callback called
    expect(getData).toHaveBeenCalledWith(diskApi.index, cfg)
  })
})
