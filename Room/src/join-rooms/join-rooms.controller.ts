import { Controller, Delete, Param, ParseIntPipe, Get } from '@nestjs/common';
import { JoinRoomsService } from './join-rooms.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/entities/user.interface';
import { ApiTags, ApiOperation } from '@nestjs/swagger';


@Controller('rooms/join')
@ApiTags('JoinRoom API')
export class JoinRoomsController {
  constructor(private readonly joinRoomsService: JoinRoomsService) {}
  
  // 채팅방 참여
  @Get('/:roomId')
  @ApiOperation({ summary: '채팅방 참여 API' })
  async joinRoom(@Param('roomId', ParseIntPipe) roomId: number, @GetUser() user: User) {
    const response = await this.joinRoomsService.joinRoom(roomId, 1);
    // const response = await this.joinRoomsService.joinRoom(roomId, user.id);
    return response;
  }

  // 채팅방 나가기
  @Delete('/:roomId')
  @ApiOperation({ summary: '채팅방 나가기 API' })
  async leaveRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ) {
    const response = await this.joinRoomsService.leaveRoom(roomId, 1);
    // const response = await this.joinRoomsService.leaveRoom(roomId, user.id);
    return response;
  }
}
