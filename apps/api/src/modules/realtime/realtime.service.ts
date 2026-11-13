import { Injectable, type MessageEvent } from '@nestjs/common';
import type { RealtimeEvent } from '@tomato/constants';
import { filter, interval, map, merge, type Observable, Subject } from 'rxjs';
import { REALTIME_HEARTBEAT_EVENT, REALTIME_HEARTBEAT_MS } from './realtime.constants';

interface RealtimeMessage {
  room: string;
  event: RealtimeEvent;
  payload: unknown;
}

@Injectable()
export class RealtimeService {
  private readonly messages = new Subject<RealtimeMessage>();

  emit(room: string, event: RealtimeEvent, payload: unknown): void {
    this.messages.next({ room, event, payload });
  }

  stream(rooms: string[]): Observable<MessageEvent> {
    const joined = new Set(rooms);
    return merge(
      this.messages.pipe(
        filter(({ room }) => joined.has(room)),
        map(({ event, payload }): MessageEvent => ({ type: event, data: payload as object })),
      ),
      interval(REALTIME_HEARTBEAT_MS).pipe(map((): MessageEvent => ({ type: REALTIME_HEARTBEAT_EVENT, data: '' }))),
    );
  }
}
