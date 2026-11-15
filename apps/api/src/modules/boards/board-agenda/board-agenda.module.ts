import { Module } from '@nestjs/common';
import { SubmissionsModule } from '../../submissions/submissions.module';
import { BoardsModule } from '../boards.module';
import { BoardAgendaController } from './board-agenda.controller';
import { BoardAgendaRepository } from './board-agenda.repository';
import { BoardAgendaService } from './board-agenda.service';

@Module({
  imports: [BoardsModule, SubmissionsModule],
  controllers: [BoardAgendaController],
  providers: [BoardAgendaService, BoardAgendaRepository],
})
export class BoardAgendaModule {}
