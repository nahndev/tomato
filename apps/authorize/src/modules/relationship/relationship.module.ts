import { Module } from '@nestjs/common';
import { SpiceDbModule } from '../spicedb/spicedb.module';
import { RelationshipService } from './relationship.service';

@Module({ imports: [SpiceDbModule], providers: [RelationshipService], exports: [RelationshipService] })
export class RelationshipModule {}
