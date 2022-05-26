import { Controller, Delete, Param, ParseIntPipe, Get } from '@nestjs/common';
import { JoinRoomsService } from './join-rooms.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/entities/user.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';


@Controller('rooms/join')
@ApiTags('JoinRoom API')
export class JoinRoomsController {
  constructor(private readonly joinRoomsService: JoinRoomsService) {}
  
  @Get('/:roomId')
  @ApiOperation({ summary: '채팅방 참여 API' })
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'roomId',
    type: 'number',
    required: true,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  async joinRoom(@Param('roomId', ParseIntPipe) roomId: number, @GetUser() user: User) {
    const response = await this.joinRoomsService.joinRoom(user.id, roomId);
    return response;
  }

  @Delete('/:roomId')
  @ApiOperation({ summary: '채팅방 나가기 API' })
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'roomId',
    type: 'number',
    required: true,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  async leaveRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ) {

    const response = await this.joinRoomsService.leaveRoom(user.id, roomId);
    return response;
  }
}
