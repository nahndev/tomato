import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_PATH, SWAGGER_TITLE } from '../common.constants';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder().setTitle(SWAGGER_TITLE).setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, { useGlobalPrefix: true });
}
