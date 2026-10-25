import { v1 } from "@authzed/authzed-node";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Env } from "../../config.schema";
import type { SpiceDbChanges, SpiceDbRef, SpiceDbRelationship } from "./spicedb.types";

const toReference = ({ type, id }: SpiceDbRef) =>
  v1.ObjectReference.create({ objectType: type, objectId: id });

const toUpdate = (operation: v1.RelationshipUpdate_Operation, { resource, relation, subject }: SpiceDbRelationship) =>
  v1.RelationshipUpdate.create({
    operation,
    relationship: v1.Relationship.create({
      resource: toReference(resource),
      relation,
      subject: v1.SubjectReference.create({
        object: toReference(subject),
        optionalRelation: subject.relation ?? '',
      }),
    }),
  });

@Injectable()
export class SpiceDbService implements OnModuleInit {
  private readonly client: ReturnType<typeof v1.NewClient>;

  constructor(config: ConfigService<Env, true>) {
    this.client = v1.NewClient(
      config.get("SPICEDB_TOKEN", { infer: true }),
      config.get("SPICEDB_ENDPOINT", { infer: true }),
      config.get("SPICEDB_INSECURE", { infer: true })
        ? v1.ClientSecurity.INSECURE_PLAINTEXT_CREDENTIALS
        : v1.ClientSecurity.SECURE,
    );
  }

  async onModuleInit() {
    await this.client.promises.writeSchema(
      v1.WriteSchemaRequest.create({
        schema: readFileSync(join(__dirname, "schema.zed"), "utf8"),
      }),
    );
  }

  async writeRelationships({ touch, remove }: SpiceDbChanges) {
    const updates = [
      ...touch.map((relationship) => toUpdate(v1.RelationshipUpdate_Operation.TOUCH, relationship)),
      ...remove.map((relationship) => toUpdate(v1.RelationshipUpdate_Operation.DELETE, relationship)),
    ];
    if (updates.length === 0) return;
    await this.client.promises.writeRelationships(v1.WriteRelationshipsRequest.create({ updates }));
  }
}
