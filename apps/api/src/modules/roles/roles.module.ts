import { Module } from "@nestjs/common";
import { DepartmentsModule } from "../departments/departments.module";
import { RolesController } from "./roles.controller";
import { RolesRepository } from "./roles.repository";
import { RolesService } from "./roles.service";

@Module({
  imports: [DepartmentsModule],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
