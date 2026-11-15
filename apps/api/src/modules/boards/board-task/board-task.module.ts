import { Module } from '@nestjs/common';
import { SubmissionsModule } from '../../submissions/submissions.module';
import { BoardsModule } from '../boards.module';
import { BoardTaskController } from './board-task.controller';
import { BoardTaskRepository } from './board-task.repository';
import { BoardTaskService } from './board-task.service';

@Module({
  imports: [BoardsModule, SubmissionsModule],
  controllers: [BoardTaskController],
  providers: [BoardTaskService, BoardTaskRepository],
})
export class BoardTaskModule {}
