import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter, setupSwagger } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
