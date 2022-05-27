import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  /**
   * 채팅방 좋아요
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} roomId 채팅방에 대한 고유 식별자
   */
  async createLike(roomId: number, userId: number): Promise<void> {
    const like = this.likeRepository.create({
      userId,
      roomId,
    });
    await like.save();
  }


  /**
   * 채팅방 좋아요 취소
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} roomId 채팅방에 대한 고유 식별자
   */
  async deleteLike(roomId: number, userId: number): Promise<void> {
    const unLike = this.likeRepository.delete({
      userId,
      roomId,
    });
  }
}
