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

  async createLike(roomId: number, userId: number): Promise<void> {
    const like = this.likeRepository.create({
      roomId,
      userId,
    });
    await like.save();
  }

  async deleteLike(roomId: number, userId: number): Promise<void> {
    const like = this.likeRepository.delete({
      roomId,
      userId,
    });
  }
}
