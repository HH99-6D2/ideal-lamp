import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { typeORMConfig } from './common/configs/typeorm.config';
import { LikesModule } from './likes/likes.module';
import { JoinRoomsModule } from './join-rooms/join-rooms.module';
import { RegionsModule } from './regions/regions.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), RoomsModule, LikesModule, JoinRoomsModule, RegionsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('rooms', 'search', 'likes', 'join');
  }
}
