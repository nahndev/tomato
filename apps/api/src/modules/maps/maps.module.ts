import { Module } from '@nestjs/common';
import { StorageFileClient } from '../../common';
import { MapsController } from './maps.controller';
import { MapsRepository } from './maps.repository';
import { MapsService } from './maps.service';

@Module({
  controllers: [MapsController],
  providers: [MapsService, MapsRepository, StorageFileClient],
})
export class MapsModule {}
