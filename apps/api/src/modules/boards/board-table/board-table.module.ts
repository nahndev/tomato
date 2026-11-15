import { Module } from '@nestjs/common';
import { SubmissionsModule } from '../../submissions/submissions.module';
import { BoardsModule } from '../boards.module';
import { BoardTableController } from './board-table.controller';
import { BoardTableRepository } from './board-table.repository';
import { BoardTableService } from './board-table.service';

@Module({
  imports: [BoardsModule, SubmissionsModule],
  controllers: [BoardTableController],
  providers: [BoardTableService, BoardTableRepository],
})
export class BoardTableModule {}
