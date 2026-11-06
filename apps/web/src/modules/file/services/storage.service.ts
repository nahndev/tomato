import { createStorageApi } from "@tomato/storage-ui";
import { storageClient } from "@/shared/lib/api-client";

export const storageApi = createStorageApi(storageClient);

export const { downloadFile: downloadStorageFile } = storageApi;
