import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { UnitsController } from './units.controller';
import { UnitsRepository } from './units.repository';
import { UnitsService } from './units.service';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService, UnitsRepository, ClientService],
  exports: [UnitsService, ClientService],
})
export class UnitsModule {}
