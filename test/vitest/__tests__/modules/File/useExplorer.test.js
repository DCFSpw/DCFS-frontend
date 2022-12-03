import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import apiConfig from "src/api/apiConfig.js";
import useExplorer from "src/modules/File/useExplorer.js";
import { useRoute } from "vue-router";

const rootUuid = "123";
const volumeUuid = "321";

vi.mock("vue-router", () => ({
  useRouter: vi.fn(() => ({
    push: () => {},
  })),
  useRoute: vi.fn(() => ({
    query: { rootUuid, volumeUuid },
  })),
}));

const mock = new MockAdapter(apiConfig);

describe("test useExplorer", () => {
  const volumeMock = { uuid: "volumeUuid", name: "volume" };
  const rootMock = { uuid: "rootUuid", name: "root" };

  afterAll(() => {
    mock.restore();
  });

  beforeEach(() => {
    mock.reset();
  });

  it("should set root from api if empty", async () => {
    useRoute.mockImplementationOnce(() => ({
      query: { rootUuid: null },
    }));

    const { root, path, setRootFromApi } = useExplorer();

    await setRootFromApi();

    expect(root.value).toBe("");
    expect(path.value).toEqual([]);
  });

  it("should set root from api if not empty", async () => {
    const { root, path, setRootFromApi } = useExplorer();
    const resultFile = { uuid: "fileUuid " };
    const resultPath = [{ uuid: "file#1" }, { uuid: "file#2" }];

    mock.onGet(`/files/manage/${rootUuid}`).reply(200, {
      success: true,
      data: { file: resultFile, path: resultPath },
    });

    await setRootFromApi();

    expect(root.value).toEqual(resultFile);
    expect(path.value).toEqual(resultPath.reverse());
  });

  it("should init volume if query is null", async () => {
    useRoute.mockImplementationOnce(() => ({
      query: { volumeUuid: null },
    }));

    const initialLoadVolumes = vi.fn();
    const getVolume = vi.fn();
    const data = { value: ["someValue"] };
    const { volume, initVolume } = useExplorer();

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    await initVolume(initialLoadVolumes, getVolume, data);

    expect(initialLoadVolumes).toHaveBeenCalled();

    expect(volume.value).toEqual(data.value[0]);
  });

  it("should init volume if query is not null", async () => {
    const resultGetVolume = { uuid: "volume-uuid" };
    const initialLoadVolumes = vi.fn();
    const getVolume = vi.fn(() => resultGetVolume);
    const data = { value: ["someValue"] };
    const { volume, initVolume } = useExplorer();

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    mock.onGet(`/files/manage/${rootUuid}`).reply(200, {
      success: true,
      data: { file: { uuid: "some-file" }, path: [] },
    });

    await initVolume(initialLoadVolumes, getVolume, data);

    expect(initialLoadVolumes).toHaveBeenCalled();
    expect(getVolume).toHaveBeenCalledWith(volumeUuid);

    expect(volume.value).toEqual(resultGetVolume);
  });

  it("should get files", async () => {
    const { getFiles, volume, root, files } = useExplorer();
    volume.value = volumeMock;
    root.value = rootMock;

    const result = [{ uuid: "file#1" }, { uuid: "file#2" }];

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: result,
    });

    await getFiles();

    // Assert good data send to api
    expect(mock.history.get.length).toBe(1);

    // Assert result set
    expect(files.value).toEqual(result);
  });

  it("should create directory", async () => {
    const data = {
      uuid: "123",
    };

    const { volume, root, createDirectory } = useExplorer();
    volume.value = volumeMock;
    root.value = rootMock;

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    mock.onPost(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    await createDirectory(data);

    // Assert good data send to api
    expect(mock.history.post.length).toBe(1);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      ...data,
      volumeUUID: volumeMock.uuid,
      rootUuid: rootMock.uuid,
    });

    expect(mock.history.get.length).toBe(1);
  });

  it("should delete file", async () => {
    const { deleteFile } = useExplorer();

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    mock.onDelete(`/files/manage/${rootMock.uuid}`).reply(200, {
      success: true,
      data: {},
    });

    await deleteFile(rootMock);

    // Assert good data send to api
    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.get.length).toBe(1);
  });

  it("should update file", async () => {
    const data = {
      uuid: "123",
    };

    const { volume, root, updateFile } = useExplorer();
    volume.value = volumeMock;
    root.value = rootMock;

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    mock.onPut(`/files/manage/${data.uuid}`).reply(200, {
      success: true,
      data: {},
    });

    await updateFile(data, data);

    // Assert good data send to api
    expect(mock.history.put.length).toBe(1);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      ...data,
      rootUUID: rootMock.uuid,
    });

    expect(mock.history.get.length).toBe(1);
  });

  it("should move file", async () => {
    const data = {
      uuid: "123",
      name: "filename",
    };

    const { moveFile } = useExplorer();

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    mock.onPut(`/files/manage/${data.uuid}`).reply(200, {
      success: true,
      data: {},
    });

    await moveFile(data, rootMock.uuid);

    // Assert good data send to api
    expect(mock.history.put.length).toBe(1);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      name: data.name,
      rootUUID: rootMock.uuid,
    });

    expect(mock.history.get.length).toBe(1);
  });

  it("should set empty path", async () => {
    const { root, path, goPath } = useExplorer();
    const resultPath = [{ uuid: "file#1" }, { uuid: "file#2" }];

    root.value = rootMock;
    path.value = resultPath;

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    await goPath(null);

    expect(root.value).toEqual("");
    expect(path.value).toEqual([]);
  });

  it("should set not empty path", async () => {
    const { root, path, goPath } = useExplorer();
    const resultFile = { uuid: "file#3" };
    const resultPath = [{ uuid: "file#1" }, { uuid: "file#2" }];

    root.value = rootMock;
    path.value = resultPath;

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    await goPath(resultFile);

    expect(root.value).toEqual(resultFile);
    expect(path.value).toEqual([...resultPath, rootMock]);
  });

  it("should set not empty path if already exists in path", async () => {
    const { root, path, goPath } = useExplorer();
    const resultFile = { uuid: "file#1" };
    const resultPath = [resultFile, { uuid: "file#2" }];

    root.value = rootMock;
    path.value = resultPath;

    mock.onGet(`/files/manage`).reply(200, {
      success: true,
      data: {},
    });

    await goPath(resultFile);

    expect(root.value).toEqual(resultFile);
    expect(path.value).toEqual([]);
  });
});
