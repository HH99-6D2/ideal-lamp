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

    /**
   * 채팅방 참여
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} roomId 채팅방에 대한 고유 식별자
   */
  async joinRoom(userId: number, roomId: number): Promise<void> {
    const room = this.joinRoomsRepository.create({
      userId,
      roomId,
    });
    await room.save()
  }

      /**
   * 채팅방 나가기
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} roomId 채팅방에 대한 고유 식별자
   */
  async leaveRoom(userId: number, roomId: number): Promise<void> {
    const room = this.joinRoomsRepository.delete({
      userId,
      roomId,
    });
  }
}
