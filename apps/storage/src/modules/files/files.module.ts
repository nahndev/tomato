import { Module } from '@nestjs/common';
import { FolderTreeModule } from '../folder-tree/folder-tree.module';
import { FilesController } from './files.controller';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';
import { FilesStorage } from './files.storage';
import { ImageVariantsListener } from './image-variants.listener';
import { ImageVariantsService } from './image-variants.service';

@Module({
  imports: [FolderTreeModule],
  controllers: [FilesController],
  providers: [FilesService, FilesRepository, FilesStorage, ImageVariantsService, ImageVariantsListener],
  exports: [FilesService],
})
export class FilesModule {}
