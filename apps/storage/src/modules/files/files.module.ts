import { Module } from '@nestjs/common';
import { FolderTreeModule } from '../folder-tree/folder-tree.module';
import { FilesController } from './files.controller';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';
import { FilesStorage } from './files.storage';

@Module({
  imports: [FolderTreeModule],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository, FilesStorage],
  exports: [FilesService],
})
export class FilesModule {}
