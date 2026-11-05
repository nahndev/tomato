import { Module } from '@nestjs/common';
import { DepartmentsModule } from '../departments/departments.module';
import { UsersAvatarStorage } from './users-avatar.storage';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DepartmentsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersAvatarStorage],
  exports: [UsersService],
})
export class UsersModule {}
