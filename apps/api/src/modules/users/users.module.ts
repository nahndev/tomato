import { Module } from '@nestjs/common';
import { DepartmentsModule } from '../departments/departments.module';
import { StorageFileClient } from './storage-file.client';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DepartmentsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, StorageFileClient],
  exports: [UsersService],
})
export class UsersModule {}
