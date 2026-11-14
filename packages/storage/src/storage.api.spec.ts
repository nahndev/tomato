import { GroupType } from "@tomato/constants";
import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";
import { createStorageApi } from "./storage.api";
import { FILES_CHUNK_SIZE, GROUPS_PAGE_SIZE } from "./storage.constants";

const BASE_URL = "/rest/storage";
const GROUP = { id: "group" };
const LIMIT = { type: { in: [GroupType.USER, GroupType.DEPARTMENT] } };

function setup() {
  const client = {
    get: vi.fn(async () => ({ data: { items: [GROUP], total: 1 } })),
    getUri: vi.fn(() => "uri"),
  };
  const api = createStorageApi(client as unknown as AxiosInstance, BASE_URL);
  return { client, api };
}

describe("createStorageApi", () => {
  it("lists groups by limit on the given base URL", async () => {
    const { client, api } = setup();

    await expect(api.listGroups(LIMIT)).resolves.toEqual([GROUP]);

    expect(client.get).toHaveBeenCalledWith("/groups", {
      baseURL: BASE_URL,
      params: {
        limit: JSON.stringify(LIMIT),
        page: 1,
        pageSize: GROUPS_PAGE_SIZE,
      },
    });
  });

  it.each([[undefined], [null]])("sends no limit for %j", async (limit) => {
    const { client, api } = setup();

    await api.listGroups(limit);

    expect(client.get).toHaveBeenCalledWith(
      "/groups",
      expect.objectContaining({
        params: { limit: undefined, page: 1, pageSize: GROUPS_PAGE_SIZE },
      }),
    );
  });

  it("loads every page", async () => {
    const { client, api } = setup();
    const OTHER = { id: "other" };
    client.get
      .mockResolvedValueOnce({ data: { items: [GROUP], total: 2 } })
      .mockResolvedValueOnce({ data: { items: [OTHER], total: 2 } });

    await expect(api.listGroups()).resolves.toEqual([GROUP, OTHER]);

    expect(client.get).toHaveBeenCalledTimes(2);
    expect(client.get).toHaveBeenLastCalledWith(
      "/groups",
      expect.objectContaining({
        params: expect.objectContaining({ page: 2 }),
      }),
    );
  });

  it("stops when the total shrinks past the last page", async () => {
    const { client, api } = setup();
    client.get
      .mockResolvedValueOnce({ data: { items: [GROUP], total: 2 } })
      .mockResolvedValueOnce({ data: { items: [], total: 2 } });

    await expect(api.listGroups()).resolves.toEqual([GROUP]);
  });

  it("builds file URLs on the given base URL", () => {
    const { client, api } = setup();

    expect(api.getFileContentUrl("file")).toBe("uri");

    expect(client.getUri).toHaveBeenCalledWith({
      baseURL: BASE_URL,
      url: "/files/file/content",
    });
  });

  it("lists files by id, in chunks the endpoint accepts", async () => {
    const get = vi.fn(async (_url: string, config: { params: { ids: string } }) => ({
      data: config.params.ids.split(",").map((id) => ({ id })),
    }));
    const api = createStorageApi({ get } as unknown as AxiosInstance, BASE_URL);
    const ids = Array.from({ length: FILES_CHUNK_SIZE + 1 }, (_, index) => `file-${index}`);

    await expect(api.listFiles(ids)).resolves.toEqual(ids.map((id) => ({ id })));

    expect(get).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenCalledWith("/files", {
      baseURL: BASE_URL,
      params: { ids: ids.slice(0, FILES_CHUNK_SIZE).join(",") },
    });
    expect(get).toHaveBeenCalledWith("/files", {
      baseURL: BASE_URL,
      params: { ids: ids.at(-1) },
    });
  });
});
