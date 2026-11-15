import { ApiParam } from '@nestjs/swagger';

export const ApiUuidParam = (name = 'id') => ApiParam({ name, format: 'uuid' });
