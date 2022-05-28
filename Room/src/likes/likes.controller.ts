import { Controller, Get, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { User } from '../entities/user.interface';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('rooms/likes')
@ApiTags('Like API')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('/:roomId')
  @ApiOperation({ summary: '채팅방 좋아요 API' })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'roomId',
    type: 'number',
    required: true,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  @ApiOkResponse({type:'string'})
  createLike(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.createLike( user.id, roomId);
  }

  @Delete('/:roomId')
  @ApiOperation({ summary: '채팅방 좋아요 취소 API' })
  @ApiBearerAuth('token')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'roomId',
    type: 'number',
    required: true,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  deleteLike(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.deleteLike(user.id, roomId);
  }
}
