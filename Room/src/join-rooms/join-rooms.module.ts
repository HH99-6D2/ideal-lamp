import { Module } from '@nestjs/common';
import { JoinRoomsService } from './join-rooms.service';
import { JoinRoomsController } from './join-rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinRoom } from '../entities/joinRoom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JoinRoom])],
  providers: [JoinRoomsService],
  controllers: [JoinRoomsController]
})
export class JoinRoomsModule {}
