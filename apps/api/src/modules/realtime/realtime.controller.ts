import { Controller, type MessageEvent, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Observable } from 'rxjs';
import { RealtimeQueryDto } from './dto/realtime-query.dto';
import { RealtimeService } from './realtime.service';

@ApiTags('realtime')
@Controller('realtime')
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Sse()
  @ApiOperation({ summary: 'Stream the events of the given rooms (server-sent events)' })
  stream(@Query() { rooms }: RealtimeQueryDto): Observable<MessageEvent> {
    return this.realtimeService.stream(rooms);
  }
}
