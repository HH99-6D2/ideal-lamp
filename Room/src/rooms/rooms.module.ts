import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';
import { Tag } from '../entities/tag.entity';
import { Like } from '../entities/like.entity';
import { JoinRoom } from '../entities/joinRoom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, RegionA, RegionB, Tag, Like, JoinRoom]),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
