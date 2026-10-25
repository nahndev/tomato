import { Module } from "@nestjs/common";
import { DepartmentsModule } from "../departments/departments.module";
import { RolesModule } from "../roles/roles.module";
import { PermissionsController } from "./permissions.controller";
import { PermissionsRepository } from "./permissions.repository";
import { PermissionsService } from "./permissions.service";

@Module({
  imports: [DepartmentsModule, RolesModule],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
