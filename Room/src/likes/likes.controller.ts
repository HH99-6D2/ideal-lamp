import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { User } from '../entities/user.interface';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('rooms/likes')
@ApiTags('Like API')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('/:roomId')
  @ApiOperation({ summary: '채팅방 좋아요 API' })
  createLike(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.createLike(roomId, 1);
    // return this.likesService.createLike(roomId, user.id);
  }

  @Delete('/:roomId')
  @ApiOperation({ summary: '채팅방 좋아요 취소 API' })
  deleteLike(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.deleteLike(roomId, 1);
    // return this.likesService.deleteLike(roomId, user.id);
  }
}
