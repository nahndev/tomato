import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server } from '@hocuspocus/server';
import type { Env } from '../../config.schema';
import { DOCUMENT_STORE_DEBOUNCE_MS, DOCUMENT_STORE_MAX_DEBOUNCE_MS } from './collab.constants';
import { CollabService } from './collab.service';

@Injectable()
export class CollabGateway implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly server: Server;

  constructor(
    private readonly collabService: CollabService,
    private readonly config: ConfigService<Env, true>,
  ) {
    this.server = new Server({
      quiet: true,
      stopOnSignals: false,
      debounce: DOCUMENT_STORE_DEBOUNCE_MS,
      maxDebounce: DOCUMENT_STORE_MAX_DEBOUNCE_MS,
      onLoadDocument: ({ documentName }) => this.collabService.load(documentName),
      onStoreDocument: ({ documentName, document }) => this.collabService.save(documentName, document),
    });
  }

  async onApplicationBootstrap() {
    await this.server.listen(this.config.get('COLLAB_WS_PORT', { infer: true }));
  }

  onModuleDestroy() {
    return this.server.destroy();
  }
}
