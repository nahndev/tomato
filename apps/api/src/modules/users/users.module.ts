import { Module } from '@nestjs/common';
import { StorageFileClient } from '../../common';
import { DepartmentsModule } from '../departments/departments.module';
import { UsersController } from './users.controller';
import { UsersDirectoryController } from './users-directory.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DepartmentsModule],
  controllers: [UsersController, UsersDirectoryController],
  providers: [UsersService, UsersRepository, StorageFileClient],
  exports: [UsersService],
})
export class UsersModule {}
