import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import useDownloadFile, {
  BLOCK_DOWNLOAD_TRIES,
  NOT_COMPLETE_HEADER_VALUE,
} from "src/modules/File/useDownloadFile.js";

const notifyMock = vi.fn();
const modalMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
    modal: modalMock,
  }),
}));

const mock = new MockAdapter(apiConfig);

describe("test useDownloadFile", () => {
  afterAll(() => {
    mock.restore();
  });

  beforeEach(() => {
    mock.reset();
  });

  it("should show toast if file is already downloading", async () => {
    const { downloadingFile, download } = useDownloadFile();
    downloadingFile.value = true;

    await download();

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(
        expect.objectContaining({
          type: "negative",
        })
      );
  });

  it("should download file with single block", async () => {
    const blobUrl = "http://localhost";
    const mockCreateObject = vi.fn(() => blobUrl);
    const mockRevokeObject = vi.fn();
    window.URL = {
      createObjectURL: mockCreateObject,
      revokeObjectURL: mockRevokeObject,
    };

    const { download, downloadingFile } = useDownloadFile();
    downloadingFile.value = null;

    const buffer = Buffer.from("abc");

    const file = { uuid: "file#1" };

    const downloadFileResponse = {
      file: { uuid: "returnedFile#1" },
      blocks: [{ uuid: "block#1" }],
    };

    mock.onPost(`/files/download/${file.uuid}`).reply(200, {
      success: true,
      data: downloadFileResponse,
    });

    mock
      .onGet(`/files/block/${downloadFileResponse.blocks[0].uuid}`)
      .reply(200, buffer);

    await download(file);

    // Assert api calls
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.get.length).toBe(1);

    expect(mockCreateObject).toHaveBeenCalled();
    expect(mockRevokeObject).toHaveBeenCalled();
  });

  it("should download file with single block if it is corrupted and show modal", async () => {
    const blobUrl = "http://localhost";
    const mockCreateObject = vi.fn(() => blobUrl);
    const mockRevokeObject = vi.fn();
    window.URL = {
      createObjectURL: mockCreateObject,
      revokeObjectURL: mockRevokeObject,
    };

    const { download, downloadingFile } = useDownloadFile();
    downloadingFile.value = null;

    const buffer = Buffer.from("abc");

    const file = { uuid: "file#1" };

    const downloadFileResponse = {
      file: { uuid: "returnedFile#1" },
      blocks: [{ uuid: "block#1" }],
    };

    mock.onPost(`/files/download/${file.uuid}`).reply(200, {
      success: true,
      data: downloadFileResponse,
    });

    mock
      .onGet(`/files/block/${downloadFileResponse.blocks[0].uuid}`)
      .reply(200, buffer, { "file-completeness": NOT_COMPLETE_HEADER_VALUE });

    await download(file);

    // Assert api calls
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.get.length).toBe(1);

    expect(mockCreateObject).toHaveBeenCalled();
    expect(mockRevokeObject).toHaveBeenCalled();

    // Assert modal shown
    expect(modalMock).toHaveBeenCalled();
  });

  it("should download file with multiple block", async () => {
    const blobUrl = "http://localhost";
    const mockCreateObject = vi.fn(() => blobUrl);
    const mockRevokeObject = vi.fn();
    window.URL = {
      createObjectURL: mockCreateObject,
      revokeObjectURL: mockRevokeObject,
    };

    const { download, downloadingFile } = useDownloadFile();
    downloadingFile.value = null;

    const buffer = Buffer.from("abc");

    const file = { uuid: "file#1" };

    const downloadFileResponse = {
      file: { uuid: "returnedFile#1" },
      blocks: [{ uuid: "block#1" }, { uuid: "block#2" }, { uuid: "block#3" }],
    };

    mock.onPost(`/files/download/${file.uuid}`).reply(200, {
      success: true,
      data: downloadFileResponse,
    });

    downloadFileResponse.blocks.forEach((block) => {
      mock.onGet(`/files/block/${block.uuid}`).reply(200, buffer);
    });

    await download(file);

    // Assert api calls
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.get.length).toBe(downloadFileResponse.blocks.length);

    expect(mockCreateObject).toHaveBeenCalled();
    expect(mockRevokeObject).toHaveBeenCalled();
  });

  it("should download file with multiple block if some are corrupted and show modal", async () => {
    const blobUrl = "http://localhost";
    const mockCreateObject = vi.fn(() => blobUrl);
    const mockRevokeObject = vi.fn();
    window.URL = {
      createObjectURL: mockCreateObject,
      revokeObjectURL: mockRevokeObject,
    };

    const { download, downloadingFile } = useDownloadFile();
    downloadingFile.value = null;

    const buffer = Buffer.from("abc");

    const file = { uuid: "file#1" };

    const downloadFileResponse = {
      file: { uuid: "returnedFile#1" },
      blocks: [{ uuid: "block#1" }, { uuid: "block#2" }, { uuid: "block#3" }],
    };

    mock.onPost(`/files/download/${file.uuid}`).reply(200, {
      success: true,
      data: downloadFileResponse,
    });

    downloadFileResponse.blocks.forEach((block, index) => {
      const headers =
        index === 0 ? { "file-completeness": NOT_COMPLETE_HEADER_VALUE } : {};

      mock.onGet(`/files/block/${block.uuid}`).reply(200, buffer, headers);
    });

    await download(file);

    // Assert api calls
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.get.length).toBe(downloadFileResponse.blocks.length);

    expect(mockCreateObject).toHaveBeenCalled();
    expect(mockRevokeObject).toHaveBeenCalled();

    // Assert modal shown
    expect(modalMock).toHaveBeenCalled();
  });

  it("should retry download block if error occurs", async () => {
    const blobUrl = "http://localhost";
    const mockCreateObject = vi.fn(() => blobUrl);
    const mockRevokeObject = vi.fn();
    window.URL = {
      createObjectURL: mockCreateObject,
      revokeObjectURL: mockRevokeObject,
    };

    const { download, downloadingFile } = useDownloadFile();
    downloadingFile.value = null;

    const buffer = Buffer.from("abc");

    const file = { uuid: "file#1" };

    const downloadFileResponse = {
      file: { uuid: "returnedFile#1" },
      blocks: [{ uuid: "block#1" }],
    };

    mock.onPost(`/files/download/${file.uuid}`).reply(200, {
      success: true,
      data: downloadFileResponse,
    });

    mock
      .onGet(`/files/block/${downloadFileResponse.blocks[0].uuid}`)
      .timeoutOnce();

    mock
      .onGet(`/files/block/${downloadFileResponse.blocks[0].uuid}`)
      .reply(200, buffer);

    await download(file);

    // Assert api calls
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.get.length).toBe(2);

    expect(mockCreateObject).toHaveBeenCalled();
    expect(mockRevokeObject).toHaveBeenCalled();
  });

  it("should throw exception when attempting to many times", async () => {
    const { download, downloadingFile } = useDownloadFile();
    downloadingFile.value = null;

    const file = { uuid: "file#1" };

    const downloadFileResponse = {
      file: { uuid: "returnedFile#1" },
      blocks: [{ uuid: "block#1" }],
    };

    mock.onPost(`/files/download/${file.uuid}`).reply(200, {
      success: true,
      data: downloadFileResponse,
    });

    mock
      .onGet(`/files/block/${downloadFileResponse.blocks[0].uuid}`)
      .abortRequest();

    try {
      await download(file);

      expect(false).toBe(true);
    } catch (e) {
      // Assert api calls
      expect(mock.history.post.length).toBe(1);
      expect(mock.history.get.length).toBe(BLOCK_DOWNLOAD_TRIES + 1);

      // Assert notification sent
      expect(notifyMock)
        .toHaveBeenCalled()
        .toHaveBeenCalledWith(expect.objectContaining({ type: "negative" }));
    }
  });
});
