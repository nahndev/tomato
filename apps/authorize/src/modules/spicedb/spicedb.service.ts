import { v1 } from "@authzed/authzed-node";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Env } from "../../config.schema";
import type { SpiceDbRef, SpiceDbRelationship } from "./spicedb.types";

const toReference = ({ type, id }: SpiceDbRef) =>
  v1.ObjectReference.create({ objectType: type, objectId: id });

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

  async touchRelationships(relationships: SpiceDbRelationship[]) {
    if (relationships.length === 0) return;
    await this.client.promises.writeRelationships(
      v1.WriteRelationshipsRequest.create({
        updates: relationships.map(({ resource, relation, subject }) =>
          v1.RelationshipUpdate.create({
            operation: v1.RelationshipUpdate_Operation.TOUCH,
            relationship: v1.Relationship.create({
              resource: toReference(resource),
              relation,
              subject: v1.SubjectReference.create({
                object: toReference(subject),
              }),
            }),
          }),
        ),
      }),
    );
  }
}
