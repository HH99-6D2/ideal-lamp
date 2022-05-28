import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Room app for Ideal Lamp')
  .setDescription('Room API Document for Ideal Lamp')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'token',
      in: 'header',
    },
    'token',
  )
  .build();
