import { PartialType } from '@nestjs/swagger';
import { CreateMapPinDto } from './create-map-pin.dto';

export class UpdateMapPinDto extends PartialType(CreateMapPinDto) {}
