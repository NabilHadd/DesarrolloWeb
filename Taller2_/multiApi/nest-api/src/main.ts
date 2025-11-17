import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS correctamente
  app.enableCors({
    origin: 'http://localhost:3000', // o '*' para desarrollo temporal
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 9001;
  await app.listen(port);
  console.log(`API corriendo en http://localhost:${port}`);
}

bootstrap();
