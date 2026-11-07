import { GroupType } from "@tomato/constants";
import type { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";
import { createStorageApi } from "./storage.api";

const BASE_URL = "/rest/storage";
const GROUP = { id: "group" };

function setup() {
  const client = {
    get: vi.fn(async () => ({ data: { items: [GROUP] } })),
    getUri: vi.fn(() => "uri"),
  };
  const api = createStorageApi(client as unknown as AxiosInstance, BASE_URL);
  return { client, api };
}

describe("createStorageApi", () => {
  it("lists groups by owner on the given base URL", async () => {
    const { client, api } = setup();
    const owner = { type: GroupType.USER, uuid: "user" };

    await expect(api.listGroups(owner)).resolves.toEqual([GROUP]);

    expect(client.get).toHaveBeenCalledWith("/groups", {
      baseURL: BASE_URL,
      params: owner,
    });
  });

  it("builds file URLs on the given base URL", () => {
    const { client, api } = setup();

    expect(api.getFileContentUrl("file")).toBe("uri");

    expect(client.getUri).toHaveBeenCalledWith({
      baseURL: BASE_URL,
      url: "/files/file/content",
    });
  });
});
