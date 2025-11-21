import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS correctamente
app.enableCors({
  origin: '*'
});

//revisar esto
  const port = 3001;
  await app.listen(port);
  console.log(`API corriendo en http://localhost:${port} interno`);
}

bootstrap();
