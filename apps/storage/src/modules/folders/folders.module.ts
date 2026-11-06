import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { FolderTreeModule } from '../folder-tree/folder-tree.module';
import { FoldersController } from './folders.controller';
import { FoldersRepository } from './folders.repository';
import { FoldersService } from './folders.service';

@Module({
  imports: [FilesModule, FolderTreeModule],
  controllers: [FoldersController],
  providers: [FoldersService, FoldersRepository],
  exports: [FoldersService],
})
export class FoldersModule {}
