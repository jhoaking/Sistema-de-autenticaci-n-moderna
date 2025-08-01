import { NestFactory} from '@nestjs/core'
import {Logger, ValidationPipe}from '@nestjs/common'
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')

   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT! );
  logger.log(`server running on port ${process.env.PORT}`)
}
bootstrap();
