import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { typeORMConfig } from './common/configs/typeorm.config';
import { LikesModule } from './likes/likes.module';
import { JoinRoomsModule } from './join-rooms/join-rooms.module';
import { RegionsModule } from './regions/regions.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), RoomsModule, LikesModule, JoinRoomsModule, RegionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
