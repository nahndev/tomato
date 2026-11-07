import { BadRequestException, Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { MAP_IMAGE_MAX_SIZE, MapLayerType } from '@tomato/constants';
import type { DepartmentMap, MapValue, PaginatedResponse } from '@tomato/types';
import { StorageFileClient, detectImageType, type PaginationQueryDto } from '../../common';
import { DepartmentsService } from '../departments/departments.service';
import type { CreateMapDto } from './dto/create-map.dto';
import type { UpdateMapDto } from './dto/update-map.dto';
import { EMPTY_MAP_VALUE } from './maps.constants';
import { toDepartmentMap, toMapValue } from './maps.mapper';
import { MapsRepository } from './maps.repository';

@Injectable()
export class MapsService {
  constructor(
    private readonly repository: MapsRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly storageFiles: StorageFileClient,
  ) {}

  async list(departmentId: string, { page, pageSize }: PaginationQueryDto): Promise<PaginatedResponse<DepartmentMap>> {
    await this.departmentsService.get(departmentId);
    const { items, total } = await this.repository.findMany(departmentId, (page - 1) * pageSize, pageSize);
    return { items: items.map(toDepartmentMap), total, page, pageSize };
  }

  async get(id: string): Promise<DepartmentMap> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return toDepartmentMap(entity);
  }

  async create(departmentId: string, dto: CreateMapDto): Promise<DepartmentMap> {
    await this.departmentsService.get(departmentId);
    return toDepartmentMap(await this.repository.create(departmentId, { name: dto.name, value: EMPTY_MAP_VALUE }));
  }

  async update(id: string, dto: UpdateMapDto): Promise<DepartmentMap> {
    const current = await this.get(id);
    const value = dto.value && toMapValue(dto.value);
    if (value) {
      const known = new Set(getImageFileIds(current.value));
      for (const fileId of new Set(getImageFileIds(value))) if (!known.has(fileId)) await this.assertImage(fileId);
    }

    const entity = await this.repository.update(id, { name: dto.name, value });
    if (!entity) throw new NotFoundException();
    return toDepartmentMap(entity);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  private async assertImage(fileId: string): Promise<void> {
    const content = await this.storageFiles.fetchContent(fileId);
    if (!content) throw new NotFoundException();
    if (content.length > MAP_IMAGE_MAX_SIZE) throw new PayloadTooLargeException();
    if (!detectImageType(content)) throw new BadRequestException();
  }
}

function getImageFileIds({ layers }: MapValue): string[] {
  return layers.flatMap((layer) => (layer.type === MapLayerType.IMAGE ? [layer.fileId] : []));
}
