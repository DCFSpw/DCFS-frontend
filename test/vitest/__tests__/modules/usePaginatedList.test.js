import { describe, expect, it, vi } from "vitest";
import usePaginatedList from "src/modules/usePaginatedList.js";

describe("test usePaginatedList", () => {
  it("should return isEmpty = true when data is empty", async () => {
    const { isEmpty } = usePaginatedList();

    expect(isEmpty.value).toBe(true);
  });

  it("should return isEmpty = true when total records is 0", async () => {
    const { isEmpty, data } = usePaginatedList();
    data.value = { pagination: { totalRecords: 0 } };

    expect(isEmpty.value).toBe(true);
  });

  it("should return isEmpty = false when total records is greater than zero", async () => {
    const { isEmpty, data } = usePaginatedList();
    data.value = { pagination: { totalRecords: 5 } };

    expect(isEmpty.value).toBe(false);
  });

  it("should call callback twice when toLastPage is set and provided page is higher than total pages", async () => {
    const { page, getData } = usePaginatedList();
    const maxPage = 4;
    const currentPage = 7;

    const callback = vi.fn(() => ({ pagination: { totalPages: maxPage } }));
    page.value = currentPage;

    await getData(callback, { toLastPage: true });

    expect(callback).toHaveBeenNthCalledWith(1, { page: currentPage });
    expect(callback).toHaveBeenNthCalledWith(2, { page: maxPage });
    expect(page.value).toBe(maxPage);
  });

  it("should should decrease current page if only one records is present", async () => {
    const { page, getData, data } = usePaginatedList();
    data.value = {
      pagination: {
        recordsOnPage: 1,
      },
    };
    const currentPage = 7;

    const callback = vi.fn();
    page.value = currentPage;

    await getData(callback, { deleting: true });

    expect(callback).toHaveBeenCalledWith({ page: currentPage - 1 });
    expect(page.value).toBe(currentPage - 1);
  });
});
