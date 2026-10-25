import { Module } from '@nestjs/common';
import { SpiceDbService } from './spicedb.service';

@Module({ providers: [SpiceDbService], exports: [SpiceDbService] })
export class SpiceDbModule {}
