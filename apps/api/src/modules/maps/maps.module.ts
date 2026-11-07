import { Module } from '@nestjs/common';
import { StorageFileClient } from '../../common';
import { DepartmentsModule } from '../departments/departments.module';
import { DepartmentMapsController } from './department-maps.controller';
import { MapPinsController } from './map-pins.controller';
import { MapsController } from './maps.controller';
import { MapsRepository } from './maps.repository';
import { MapsService } from './maps.service';

@Module({
  imports: [DepartmentsModule],
  controllers: [DepartmentMapsController, MapsController, MapPinsController],
  providers: [MapsService, MapsRepository, StorageFileClient],
})
export class MapsModule {}
