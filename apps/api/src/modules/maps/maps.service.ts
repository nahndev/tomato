import { BadRequestException, Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { MAP_IMAGE_MAX_SIZE } from '@tomato/constants';
import type { DepartmentMap, DepartmentMapDetail, MapPin, PaginatedResponse } from '@tomato/types';
import { StorageFileClient, detectImageType, type PaginationQueryDto } from '../../common';
import { DepartmentsService } from '../departments/departments.service';
import type { CreateMapPinDto } from './dto/create-map-pin.dto';
import type { CreateMapDto } from './dto/create-map.dto';
import type { UpdateMapPinDto } from './dto/update-map-pin.dto';
import type { UpdateMapDto } from './dto/update-map.dto';
import { toDepartmentMap, toDepartmentMapDetail, toMapPin } from './maps.mapper';
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

  async get(id: string): Promise<DepartmentMapDetail> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundException();
    return toDepartmentMapDetail(entity);
  }

  async create(departmentId: string, dto: CreateMapDto): Promise<DepartmentMap> {
    await this.departmentsService.get(departmentId);
    return toDepartmentMap(await this.repository.create(departmentId, { name: dto.name }));
  }

  async update(id: string, dto: UpdateMapDto): Promise<DepartmentMap> {
    const entity = await this.repository.update(id, { name: dto.name });
    if (!entity) throw new NotFoundException();
    return toDepartmentMap(entity);
  }

  async setImage(id: string, fileId: string): Promise<DepartmentMap> {
    if (!(await this.repository.findById(id))) throw new NotFoundException();
    const content = await this.storageFiles.fetchContent(fileId);
    if (!content) throw new NotFoundException();
    if (content.length > MAP_IMAGE_MAX_SIZE) throw new PayloadTooLargeException();
    if (!detectImageType(content)) throw new BadRequestException();

    const entity = await this.repository.update(id, { imageFileId: fileId });
    if (!entity) throw new NotFoundException();
    return toDepartmentMap(entity);
  }

  async remove(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new NotFoundException();
  }

  async addPin(mapId: string, dto: CreateMapPinDto): Promise<MapPin> {
    const entity = await this.repository.createPin(mapId, {
      label: dto.label,
      description: dto.description,
      x: dto.x,
      y: dto.y,
    });
    if (!entity) throw new NotFoundException();
    return toMapPin(entity);
  }

  async updatePin(mapId: string, id: string, dto: UpdateMapPinDto): Promise<MapPin> {
    const entity = await this.repository.updatePin(mapId, id, {
      label: dto.label,
      description: dto.description,
      x: dto.x,
      y: dto.y,
    });
    if (!entity) throw new NotFoundException();
    return toMapPin(entity);
  }

  async removePin(mapId: string, id: string): Promise<void> {
    if (!(await this.repository.deletePin(mapId, id))) throw new NotFoundException();
  }
}
