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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ResponseRoomDto } from './dto/response-room.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/entities/user.interface';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('rooms')
@ApiTags('Room API')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '채팅방 생성 API' })
  @ApiBearerAuth('token')
  @ApiBody({
    type: CreateRoomDto,
    description: '채팅방 생성 정보',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @GetUser() user: User,
  ) {
    const response = await this.roomsService.createRoom(createRoomDto, user.id);
    return response;
  }

  @Get('/')
  @ApiOperation({ summary: '채팅방 추천 리스트 조회 API' })
  @ApiBearerAuth('token')
  @ApiOkResponse({ type: [ResponseRoomDto] })
  getRecommendationRooms(
    @GetUser() user: User = null,
  ): Promise<ResponseRoomDto[]> {
    const response = this.roomsService.getRecommendationRooms(
      user ? user.id : 0,
    );
    return response;
  }

  @Get('/search')
  @ApiOperation({ summary: '채팅방 리스트 조건 조회 API' })
  @ApiBearerAuth('token')
  @ApiQuery({
    name: 'category',
    type: 'string',
    required: false,
    example: '스포츠',
    description: '주제',
  })
  @ApiQuery({
    name: 'word',
    type: 'string',
    required: false,
    example: '잠실야구장',
    description: '장소 또는 1개의 태그 ',
  })
  @ApiQuery({
    name: 'startDate',
    type: 'Date',
    required: false,
    example: '2022-05-30',
    description: '검색 시작 날짜',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'Date',
    required: false,
    example: '2022-06-06',
    description: '검색 종료 날짜',
  })
  @ApiQuery({
    name: 'regionAId',
    type: 'number',
    required: false,
    example: 1,
    description: '시/도 (서울/경기)) 고유 번호',
  })
  @ApiQuery({
    name: 'regionBId',
    type: 'number',
    required: false,
    example: 18,
    description: '구/시 (강남구/수원시) 고유 번호',
  })
  @ApiQuery({
    name: 'sort',
    type: 'number',
    required: false,
    example: 1,
    description: '정렬 타입: 1. 좋아요순, 2.참여도순, 3.최신순',
  })
  @ApiOkResponse({ type: [ResponseRoomDto] })
  getRoomsByQuery(
    @Query('category') category: string,
    @Query('word') word: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('regionAId') regionAId: number,
    @Query('regionBId') regionBId: number,
    @Query('sort', ParseIntPipe) sort: number,
    @GetUser() user: User = null,
  ): Promise<ResponseRoomDto[]> {
    const response = this.roomsService.getRoomsByQuery(
      user ? user.id : 0,
      category,
      startDate,
      endDate,
      sort ? sort : 1,
      regionAId,
      regionBId,
      word,
    );
    return response;
  }

  @Get('/management')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '채팅방 관리 리스트 API' })
  @ApiBearerAuth('token')
  @ApiQuery({
    name: 'option',
    type: 'number',
    required: false,
    example: 1,
    description: '조회 타입: 1.만든 채팅, 2.참여 채팅, 3.관심 채팅',
  })
  @ApiOkResponse({ type: [ResponseRoomDto] })
  getManagementRooms(
    @Query('option', ParseIntPipe) option: number,
    @GetUser() user: User,
  ): Promise<ResponseRoomDto[]> {
    const response = this.roomsService.getManagementRooms(user.id, option);
    return response;
  }

  @Get('/:id')
  @ApiOperation({ summary: '채팅방 상세 조회 API' })
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: false,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  @ApiOkResponse({ type: ResponseRoomDto })
  getRoomById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User = null,
  ): Promise<ResponseRoomDto> {
    const response = this.roomsService.getRoomById(user ? user.id : 0, id);
    return response;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '채팅방 수정 API' })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: false,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  @ApiBody({
    type: UpdateRoomDto,
    description: '채팅방 수정 정보',
  })
  @ApiBearerAuth('token')
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomDto: UpdateRoomDto,
    @GetUser() user: User,
  ) {
    const response = await this.roomsService.updateRoom(
      user.id,
      id,
      updateRoomDto,
    );

    return response;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '채팅방 삭제 API' })
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
    example: 1,
    description: '채팅방에 대한 고유 식별자',
  })
  async deleteRoom(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const response = await this.roomsService.deleteRoom(user.id, id);

    return response;
  }
}
