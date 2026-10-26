import { PERMISSION_RESOURCE_ALL } from '@tomato/constants';

const UUID_PATTERN = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

export const PERMISSION_RESOURCE_ID_PATTERN = new RegExp(`^(${PERMISSION_RESOURCE_ALL}|${UUID_PATTERN})$`);
