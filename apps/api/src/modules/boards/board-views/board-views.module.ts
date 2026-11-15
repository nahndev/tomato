import { Module } from '@nestjs/common';
import { BoardsModule } from '../boards.module';
import { BoardViewsController } from './board-views.controller';
import { BoardViewsRepository } from './board-views.repository';
import { BoardViewsService } from './board-views.service';

@Module({
  imports: [BoardsModule],
  controllers: [BoardViewsController],
  providers: [BoardViewsService, BoardViewsRepository],
})
export class BoardViewsModule {}
