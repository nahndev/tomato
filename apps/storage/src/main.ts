import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {
  GLOBAL_PREFIX,
  HttpExceptionFilter,
  KafkaService,
  SWAGGER_PATH,
  SWAGGER_TITLE,
  createValidationPipe,
} from "./common";
import type { Env } from "./config.schema";
import { CDC_TOPICS } from "./modules/cdc/cdc.constants";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  app.enableShutdownHooks();

  app.setGlobalPrefix(GLOBAL_PREFIX);
  // Prisma `BigInt` columns (`File.size`).
  app.set("json replacer", (_key: string, value: unknown) =>
    typeof value === "bigint" ? Number(value) : value,
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(createValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setVersion("1.0")
    .build();
  SwaggerModule.setup(
    SWAGGER_PATH,
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    { useGlobalPrefix: true },
  );
  await app.listen(config.get("STORAGE_PORT", { infer: true }));

  app.get(KafkaService).startConsumer(app, CDC_TOPICS);
}

void bootstrap();
