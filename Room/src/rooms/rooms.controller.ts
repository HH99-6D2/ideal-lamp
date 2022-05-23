import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ResponseRoomDto } from './dto/response-room.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/entities/user.interface';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
@ApiTags('Room API')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  /**
   * 채팅방 추천 리스트 조회
   * @GetUser {User} user? = null 접속한 유저에 대한 고유식별자
   */
  @Get('/')
  @ApiOperation({ summary: '채팅방 추천 리스트 조회 API' })
  @ApiOkResponse({ type: ResponseRoomDto })
  getRecommendationRooms(
    @GetUser() user: User = null,
  ): Promise<ResponseRoomDto[]> {
    const response = this.roomsService.getRecommendationRooms(
      user ? user.id : 1,
    );
    return response;
  }

  /**
   * 채팅방 리스트 조건 조회
   * @Param {string} category 채팅방 주제
   * @Querystring {string} tag 태그
   * @Querystring {date} startDate 시작 날짜
   * @Querystring {date} endDate 종료 날짜
   * @Querystring {string} regionAId 시/도 정보
   * @Querystring {string} regionBId 구/시 정보
   * @Querystring {number} sort 정렬 옵션 (1:좋아요순, 2:참여도순, 3:최신순)
   * @GetUser {User} user? = null 접속한 유저에 대한 고유식별자
   */
  @Get('/:category')
  @ApiOperation({ summary: '채팅방 리스트 조건 조회 API' })
  @ApiOkResponse({ type: ResponseRoomDto })
  getRoomsByQuery(
    @Param('category') category: string,
    @Query('tag') tag: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('regionAId') regionAId: number,
    @Query('regionBId') regionBId: number,
    @Query('sort') sort: number,
    @GetUser() user: User = null,
  ): Promise<ResponseRoomDto[]> {
    const response = this.roomsService.getRoomsByQuery(1);
    // const response = this.roomsService.getRoomsByQuery(user ? user.id : 0);
    return response;
  }

  /**
   * 채팅방 관리 리스트 조회
   * @Param {number} options 관리 목록 옵션 (1:만든 목록, 2:참여 목록, 3:관심 목록)
   * @GetUser {User} user 접속한 유저에 대한 고유식별자
   */
  @Get('/management/:option')
  @ApiOperation({ summary: '채팅방 관리 리스트 API' })
  @ApiOkResponse({ type: ResponseRoomDto })
  getManagementRooms(
    @Param('option', ParseIntPipe) option: number,
    @GetUser() user: User,
  ): Promise<ResponseRoomDto[]> {
    const response = this.roomsService.getManagementRooms(option, user.id);
    return response;
  }

  /**
   * 채팅방 생성
   * @Body {CreateRoomDto} createRoomDto 채팅방 생성 정보
   * @GetUser {User} user 채팅방 생성 유저에 대한 고유 식별자
   */
  @Post('/')
  @ApiOperation({ summary: '채팅방 생성 API' })
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    // @GetUser() user: User,
  ) {
    const response = await this.roomsService.createRoom(createRoomDto, 5);
    return response;
  }

  /**
   * 채팅방 상세 조회
   * @Param {number} id 채팅방에 대한 고유 식별자
   * @Param {interfase} user? = null 접속한 유저에 대한 고유식별자
   */
  @Get('/:id')
  @ApiOperation({ summary: '채팅방 상세 조회 API' })
  @ApiOkResponse({ type: ResponseRoomDto })
  getRoomById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User = null,
  ): Promise<ResponseRoomDto> {
    const response = this.roomsService.getRoomById(id, user ? user.id : 0);
    return response;
  }

  // 채팅방 수정
  @Put('/:id')
  @ApiOperation({ summary: '채팅방 수정 API' })
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
    @GetUser() user: User,
  ) {
    const response = await this.roomsService.updateRoom(updateRoomDto, 1);
    // const response = await this.roomsService.createRoom(createRoomDto, user.id);

    return response;
  }

  // 채팅방 삭제
  @Delete('/:id')
  @ApiOperation({ summary: '채팅방 삭제 API' })
  async deleteRoom(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const response = await this.roomsService.deleteRoom(id, 1);
    // const response = await this.roomsService.deleteRoom(id, user.id);

    return response;
  }

}
