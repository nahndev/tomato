import { Module } from '@nestjs/common';
import { TemplateCategoriesController } from './template-categories.controller';
import { TemplateCategoriesRepository } from './template-categories.repository';
import { TemplateCategoriesService } from './template-categories.service';

@Module({
  controllers: [TemplateCategoriesController],
  providers: [TemplateCategoriesService, TemplateCategoriesRepository],
  exports: [TemplateCategoriesService],
})
export class TemplateCategoriesModule {}
