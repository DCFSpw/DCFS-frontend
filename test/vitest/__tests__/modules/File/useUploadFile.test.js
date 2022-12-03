import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import useUploadFile, {
  RETRY_UPLOAD_HTTP_CODE,
} from "src/modules/File/useUploadFile.js";
import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import useExplorer from "src/modules/File/useExplorer.js";

const notifyMock = vi.fn();
vi.mock("src/modules/useNotification", () => ({
  default: () => ({
    notify: notifyMock,
  }),
}));

vi.mock("src/modules/File/useExplorer", () => ({
  default: vi.fn(() => ({
    volume: {},
    root: {},
    getFiles: () => {},
  })),
}));

const mock = new MockAdapter(apiConfig);

describe("test useDownloadFile", () => {
  function formDataMock() {
    this.append = vi.fn();
    this.set = vi.fn();
  }

  afterAll(() => {
    mock.restore();
  });

  beforeEach(() => {
    mock.reset();

    global.FormData = formDataMock;
  });

  it("should return if volume is empty", async () => {
    const { volume, upload } = useUploadFile();
    volume.value = null;

    await upload();
  });

  it("should upload file", async () => {
    const sliceMock = vi.fn();
    const file = { name: "file-to-upload", size: 111, slice: sliceMock };

    const volume = { value: { uuid: "volume#1", name: "volumeName" } };
    const root = { value: { uuid: "root#1", name: "rootName" } };
    const getFiles = vi.fn();
    useExplorer.mockImplementationOnce(() => ({
      volume,
      root,
      getFiles,
    }));

    const initUploadResponse = {
      file: { uuid: "uploadingFile#1", name: "someUploadingFile" },
      blocks: [
        { uuid: "123", order: 1 },
        { uuid: "321", order: 2 },
      ],
    };

    const { upload } = useUploadFile();

    mock.onPost(`/files/upload`).reply(200, {
      success: true,
      data: initUploadResponse,
    });

    initUploadResponse.blocks.forEach((block) => {
      mock.onPost(`/files/block/${block.uuid}`).reply(200, {
        success: true,
      });
    });

    mock.onPost(`/files/upload/${initUploadResponse.file.uuid}`).reply(200, {
      success: true,
      data: initUploadResponse,
    });

    await upload(file);

    expect(mock.history.post.length).toBe(4);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      volumeUUID: volume.value.uuid,
      rootUUID: root.value.uuid,
      file: {
        name: file.name,
        type: 2,
        size: file.size,
      },
    });

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));
  });

  it("should retry upload block", async () => {
    const sliceMock = vi.fn();
    const file = { name: "file-to-upload", size: 111, slice: sliceMock };

    const volume = { value: { uuid: "volume#1", name: "volumeName" } };
    const root = { value: { uuid: "root#1", name: "rootName" } };
    const getFiles = vi.fn();
    useExplorer.mockImplementationOnce(() => ({
      volume,
      root,
      getFiles,
    }));

    const initUploadResponse = {
      file: { uuid: "uploadingFile#1", name: "someUploadingFile" },
      blocks: [
        { uuid: "123", order: 1 },
        { uuid: "321", order: 2 },
      ],
    };

    const { upload } = useUploadFile();

    mock.onPost(`/files/upload`).reply(200, {
      success: true,
      data: initUploadResponse,
    });

    initUploadResponse.blocks.forEach((block) => {
      mock.onPost(`/files/block/${block.uuid}`).abortRequestOnce();

      mock.onPost(`/files/block/${block.uuid}`).reply(200, {
        success: true,
      });
    });

    mock.onPost(`/files/upload/${initUploadResponse.file.uuid}`).reply(200, {
      success: true,
      data: initUploadResponse,
    });

    await upload(file);

    expect(mock.history.post.length).toBe(6);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      volumeUUID: volume.value.uuid,
      rootUUID: root.value.uuid,
      file: {
        name: file.name,
        type: 2,
        size: file.size,
      },
    });

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));
  });

  it("should retry upload full file", async () => {
    const sliceMock = vi.fn();
    const file = { name: "file-to-upload", size: 111, slice: sliceMock };

    const volume = { value: { uuid: "volume#1", name: "volumeName" } };
    const root = { value: { uuid: "root#1", name: "rootName" } };
    const getFiles = vi.fn();
    useExplorer.mockImplementationOnce(() => ({
      volume,
      root,
      getFiles,
    }));

    const initUploadResponse = {
      file: { uuid: "uploadingFile#1", name: "someUploadingFile" },
      blocks: [
        { uuid: "123", order: 1 },
        { uuid: "321", order: 2 },
      ],
    };

    const { upload } = useUploadFile();

    mock.onPost(`/files/upload`).reply(200, {
      success: true,
      data: initUploadResponse,
    });

    initUploadResponse.blocks.forEach((block) => {
      mock.onPost(`/files/block/${block.uuid}`).reply(200, {
        success: true,
      });
    });

    let isFirst = true;

    mock.onPost(`/files/upload/${initUploadResponse.file.uuid}`).reply(() => {
      if (isFirst) {
        isFirst = false;
        return [
          RETRY_UPLOAD_HTTP_CODE,
          {
            success: true,
            data: initUploadResponse.blocks,
          },
        ];
      }

      return [200, { success: true }];
    });

    await upload(file);

    expect(mock.history.post.length).toBe(5);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      volumeUUID: volume.value.uuid,
      rootUUID: root.value.uuid,
      file: {
        name: file.name,
        type: 2,
        size: file.size,
      },
    });

    // Assert notification sent
    expect(notifyMock)
      .toHaveBeenCalled()
      .toHaveBeenCalledWith(expect.objectContaining({ type: "positive" }));
  });
});
