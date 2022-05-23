import { Injectable } from '@nestjs/common';
import { JoinRoom } from '../entities/joinRoom.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JoinRoomsService {
  constructor(
    @InjectRepository(JoinRoom)
    private readonly joinRoomsRepository: Repository<JoinRoom>,
  ) {}

  async joinRoom(roomId: number, userId: number): Promise<void> {
    const room = this.joinRoomsRepository.create({
      roomId,
      userId,
    });
    await this.joinRoomsRepository.save(room);
  }

  async leaveRoom(roomId: number, userId: number): Promise<void> {
    const room = this.joinRoomsRepository.delete({
      roomId,
      userId,
    });
  }
}
