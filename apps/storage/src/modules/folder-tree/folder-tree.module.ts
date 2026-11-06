import { Module } from '@nestjs/common';
import { FolderTreeRepository } from './folder-tree.repository';

@Module({
  providers: [FolderTreeRepository],
  exports: [FolderTreeRepository],
})
export class FolderTreeModule {}
