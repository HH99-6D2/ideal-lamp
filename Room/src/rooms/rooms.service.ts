import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from '../entities/room.entity';
import {
  Brackets,
  getConnection,
  getManager,
  getRepository,
  In,
  Not,
  Repository,
} from 'typeorm';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';
import { Tag } from '../entities/tag.entity';
import { Like } from '../entities/like.entity';
import { ResponseRoomDto } from './dto/response-room.dto';
import * as moment from 'moment-timezone';
import { JoinRoom } from '../entities/joinRoom.entity';
import { UpdateRoomDto } from './dto/update-room.dto';
import { getEnabledCategories } from 'trace_events';
import { query } from 'express';
import { User } from 'src/entities/user.interface';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(JoinRoom)
    private readonly joinRoomRepository: Repository<JoinRoom>,
    @InjectRepository(RegionA)
    private readonly regionARepository: Repository<RegionA>,
    @InjectRepository(RegionB)
    private readonly regionBRepository: Repository<RegionB>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  /**
   * 채팅방 생성
   * {CreateRoomDto} createRoomDto 채팅방 생성 정보
   * {number} userId 채팅방 생성 유저에 대한 고유 식별자
   */
  async createRoom(createRoomDto: CreateRoomDto, userId: number) {
    const { tags, regionAName, regionBName } = createRoomDto;

    try {
      const regionA = await this.regionARepository.findOne({
        name: regionAName,
      });

      const regionB = await this.regionBRepository.findOne({
        name: regionBName,
        regionAId: regionA.id,
      });

      let roomTags: Tag[] = [];

      for (const tag of tags) {
        const findTag = await this.tagRepository.findOne({
          name: tag.toString(),
        });

        if (findTag) {
          roomTags.push(findTag);
        } else {
          const insertTag = this.tagRepository.create({
            name: tag.toString(),
          });
          await insertTag.save();

          roomTags.push(insertTag);
        }
      }

      const room = this.roomRepository.create({
        ...createRoomDto,
        userId,
        status: new Date(createRoomDto.startDate) <= new Date() ? 1 : 0,
        regionA: regionA.id,
        regionB: regionB.id,
        tags: roomTags,
      });

      const response = await room.save();

      return {
        status: 'success',
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  /**
   * 채팅방 추천 리스트 조회
   * {number} userId 접속한 유저에 대한 고유식별자
   */
  async getRecommendationRooms(userId: number): Promise<ResponseRoomDto[]> {
    const resRooms: ResponseRoomDto[] = [];

    const findRooms = await this.roomRepository
      .createQueryBuilder('room')
      .where({ status: Not(2) })
      .leftJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .take(20)
      .getMany();

    console.log(findRooms.map((x) => x.id));

    if (findRooms.length < 1) {
      throw new NotFoundException();
    }
    try {
      for (const findRoom of findRooms) {
        let resRoom: ResponseRoomDto = new ResponseRoomDto();
        resRoom.id = findRoom.id;
        resRoom.userId = findRoom.userId;
        resRoom.title = findRoom.title;
        resRoom.positionX = findRoom.positionX;
        resRoom.positionY = findRoom.positionY;
        resRoom.spot = findRoom.spot;
        resRoom.status = findRoom.status;
        resRoom.category = findRoom.category;
        resRoom.imageUrl = findRoom.imageUrl;
        resRoom.startDate = moment(findRoom.startDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        resRoom.endDate = moment(findRoom.endDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );

        let regionA = JSON.parse(JSON.stringify(findRoom.regionA));
        let regionB = JSON.parse(JSON.stringify(findRoom.regionB));
        resRoom.regionAName = regionA ? regionA.name : null;
        resRoom.regionBName = regionB ? regionB.name : null;

        resRoom.tags = findRoom.tags.map((x) => x.name);

        const isLike = await this.likeRepository.findOne({
          userId,
          roomId: resRoom.id,
        });
        resRoom.isLike = isLike ? true : false;

        const likeCnt = await this.likeRepository
          .createQueryBuilder('like')
          .where({ roomId: findRoom.id })
          .getCount();
        resRoom.likeCnt = likeCnt;

        const isJoined = await this.joinRoomRepository.findOne({
          userId,
          roomId: resRoom.id,
        });
        resRoom.isJoined = isJoined ? true : false;

        const joinCnt = await this.joinRoomRepository
          .createQueryBuilder('joinRoom')
          .where({ roomId: findRoom.id })
          .getCount();
        resRoom.joinCnt = joinCnt;

        resRooms.push(resRoom);
      }

      resRooms.sort(function (a, b) {
        return a.likeCnt <= b.likeCnt ? 1 : -1;
      });

      return resRooms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 채팅방 리스트 조건 조회
   * {number} userId 접속한 유저에 대한 고유식별자
   * {string} category 채팅방 주제
   * {string} tag 태그
   * {date} startDate 채팅 시작 날짜
   * {date} endDate 채팅 종료 날짜
   * {string} regionAId 시/도 정보
   * {string} regionBId 구/시 정보
   * {number} sort 정렬 옵션 (1:좋아요순, 2:참여도순, 3:최신순)
   */
  async getRoomsByQuery(
    userId: number,
    category: string,
    startDate: Date,
    endDate: Date,
    sort: number,
    regionAId?: number,
    regionBId?: number,
    word?: string,
  ): Promise<ResponseRoomDto[]> {
    const resRooms: ResponseRoomDto[] = [];

    let query = await this.roomRepository
      .createQueryBuilder('room')
      .where({ status: Not(2) })
      .leftJoinAndSelect('room.tags', 'tag')
      .andWhere('room.category = :category', { category })
      .andWhere(
        new Brackets((query) => {
          query
            .where(
              new Brackets((query) => {
                query
                  .where('room.startDate <= :startDate', { startDate })
                  .andWhere('room.endDate >= :endDate', { endDate });
              }),
            )
            .orWhere(
              new Brackets((query) => {
                query
                  .where('room.startDate >= :startDate', { startDate })
                  .andWhere('room.endDate <= :endDate', { endDate });
              }),
            )
            .orWhere(
              new Brackets((query) => {
                query
                  .where('room.startDate >= :startDate', { startDate })
                  .andWhere('room.startDate <= :endDate', { endDate });
              }),
            )
            .orWhere(
              new Brackets((query) => {
                query
                  .where('room.endDate >= :startDate', { startDate })
                  .andWhere('room.endDate <= :endDate', { endDate });
              }),
            );
        }),
      );

    if (word) {
      query.andWhere(
        new Brackets((query) => {
          query
            .andWhere('tag.name = :name', { name: word })
            .orWhere('room.spot = :spot', { spot: word });
        }),
      );
    }

    if (regionAId) {
      query.andWhere('room.regionA = :regionA', { regionA: regionAId });
    }

    if (regionBId) {
      query.andWhere('room.regionB = :regionB', { regionB: regionBId });
    }

    let findRooms = await query.take(20).getMany();

    const roomIds = findRooms.map((x) => x.id);

    findRooms = await this.roomRepository
      .createQueryBuilder('room')
      .whereInIds(roomIds)
      .leftJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .getMany();

    if (findRooms.length < 1) {
      throw new NotFoundException();
    }
    try {
      for (const findRoom of findRooms) {
        let resRoom: ResponseRoomDto = new ResponseRoomDto();
        resRoom.id = findRoom.id;
        resRoom.userId = findRoom.userId;
        resRoom.title = findRoom.title;
        resRoom.positionX = findRoom.positionX;
        resRoom.positionY = findRoom.positionY;
        resRoom.spot = findRoom.spot;
        resRoom.status = findRoom.status;
        resRoom.category = findRoom.category;
        resRoom.imageUrl = findRoom.imageUrl;
        resRoom.startDate = moment(findRoom.startDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        resRoom.endDate = moment(findRoom.endDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        resRoom.createdDate = moment(findRoom.createdDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );

        let regionA = JSON.parse(JSON.stringify(findRoom.regionA));
        let regionB = JSON.parse(JSON.stringify(findRoom.regionB));
        resRoom.regionAName = regionA ? regionA.name : null;
        resRoom.regionBName = regionB ? regionB.name : null;

        resRoom.tags = findRoom.tags.map((x) => x.name);

        const isLike = await this.likeRepository.findOne({
          userId,
          roomId: resRoom.id,
        });
        resRoom.isLike = isLike ? true : false;

        const likeCnt = await this.likeRepository
          .createQueryBuilder('like')
          .where({ roomId: findRoom.id })
          .getCount();
        resRoom.likeCnt = likeCnt;

        const isJoined = await this.joinRoomRepository.findOne({
          userId,
          roomId: resRoom.id,
        });
        resRoom.isJoined = isJoined ? true : false;

        const joinCnt = await this.joinRoomRepository
          .createQueryBuilder('joinRoom')
          .where({ roomId: findRoom.id })
          .getCount();
        resRoom.joinCnt = joinCnt;

        resRooms.push(resRoom);
      }

      switch (sort) {
        case 1: // 좋아요순
          resRooms.sort(function (a, b) {
            return a.likeCnt <= b.likeCnt ? 1 : -1;
          });
          break;
        case 2: // 참여도순
          resRooms.sort(function (a, b) {
            return a.joinCnt <= b.joinCnt ? 1 : -1;
          });
          break;
        case 3: // 최신순
          resRooms.sort(function (a, b) {
            return a.createdDate >= b.createdDate ? 1 : -1;
          });
          break;
      }

      return resRooms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 채팅방 관리 리스트 조회
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} option 조회 타입 (1:만든 채팅, 2:참여 채팅, 3:관심 채팅)
   */
  async getManagementRooms(
    userId: number,
    option: number,
  ): Promise<ResponseRoomDto[]> {
    let resRooms: ResponseRoomDto[] = [];

    const findRooms = await this.roomRepository
      .createQueryBuilder('room')
      .where({ status: Not(2) })
      .leftJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .getMany();

    if (findRooms.length < 1) {
      throw new NotFoundException();
    }
    try {
      for (const findRoom of findRooms) {
        let resRoom: ResponseRoomDto = new ResponseRoomDto();
        resRoom.id = findRoom.id;
        resRoom.userId = findRoom.userId;
        resRoom.title = findRoom.title;
        resRoom.positionX = findRoom.positionX;
        resRoom.positionY = findRoom.positionY;
        resRoom.spot = findRoom.spot;
        resRoom.status = findRoom.status;
        resRoom.category = findRoom.category;
        resRoom.imageUrl = findRoom.imageUrl;
        resRoom.startDate = moment(findRoom.startDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        resRoom.endDate = moment(findRoom.endDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );

        let regionA = JSON.parse(JSON.stringify(findRoom.regionA));
        let regionB = JSON.parse(JSON.stringify(findRoom.regionB));
        resRoom.regionAName = regionA ? regionA.name : null;
        resRoom.regionBName = regionB ? regionB.name : null;

        resRoom.tags = findRoom.tags.map((x) => x.name);

        const isLike = await this.likeRepository.findOne({
          userId,
          roomId: resRoom.id,
        });
        resRoom.isLike = isLike ? true : false;

        const likeCnt = await this.likeRepository
          .createQueryBuilder('like')
          .where({ roomId: findRoom.id })
          .getCount();
        resRoom.likeCnt = likeCnt;

        const isJoined = await this.joinRoomRepository.findOne({
          userId,
          roomId: resRoom.id,
        });
        resRoom.isJoined = isJoined ? true : false;

        const joinCnt = await this.joinRoomRepository
          .createQueryBuilder('joinRoom')
          .where({ roomId: findRoom.id })
          .getCount();
        resRoom.joinCnt = joinCnt;

        resRooms.push(resRoom);
      }

      switch (option) {
        case 1: //만든 목록
          resRooms = resRooms.filter((x) => {
            if (x.userId === userId) return x;
          });
          break;
        case 2: // 참여 목록
          resRooms = resRooms.filter((x) => {
            if (x.isJoined) return x;
          });
          break;
        case 3: // 관심 목록
          resRooms = resRooms.filter((x) => {
            if (x.isLike) return x;
          });
          break;
      }

      return resRooms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 채팅방 상세 조회
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} id 채팅방에 대한 고유 식별자
   */
  async getRoomById(userId: number, id: number): Promise<ResponseRoomDto> {
    let resRoom: ResponseRoomDto = new ResponseRoomDto();

    const findRoom = await this.roomRepository
      .createQueryBuilder('room')
      .where({ id, status: Not(2) })
      .leftJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .getOne();

    console.log(findRoom);

    if (!findRoom) {
      throw new NotFoundException();
    }

    try {
      resRoom.id = findRoom.id;
      resRoom.userId = findRoom.userId;
      resRoom.title = findRoom.title;
      resRoom.positionX = findRoom.positionX;
      resRoom.positionY = findRoom.positionY;
      resRoom.spot = findRoom.spot;
      resRoom.status = findRoom.status;
      resRoom.category = findRoom.category;
      resRoom.imageUrl = findRoom.imageUrl;
      resRoom.startDate = moment(findRoom.startDate).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      resRoom.endDate = moment(findRoom.endDate).format('YYYY-MM-DD HH:mm:ss');

      let regionA = JSON.parse(JSON.stringify(findRoom.regionA));
      let regionB = JSON.parse(JSON.stringify(findRoom.regionB));
      resRoom.regionAName = regionA ? regionA.name : null;
      resRoom.regionBName = regionB ? regionB.name : null;

      resRoom.tags = findRoom.tags.map((x) => x.name);

      const isLike = await this.likeRepository.findOne({
        userId,
        roomId: resRoom.id,
      });
      resRoom.isLike = isLike ? true : false;

      const likeCnt = await this.likeRepository
        .createQueryBuilder('like')
        .where({ roomId: findRoom.id })
        .getCount();
      resRoom.likeCnt = likeCnt;

      const isJoined = await this.joinRoomRepository.findOne({
        userId,
        roomId: resRoom.id,
      });
      resRoom.isJoined = isJoined ? true : false;

      const joinCnt = await this.joinRoomRepository
        .createQueryBuilder('joinRoom')
        .where({ roomId: findRoom.id })
        .getCount();
      resRoom.joinCnt = joinCnt;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return resRoom;
  }

  /**
   * 채팅방 수정
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} id 채팅방에 대한 고유 식별자
   * {UpdateRoomDto} updateRoomDto 채팅방 수정 정보
   */
  async updateRoom(userId: number, id: number, updateRoomDto: UpdateRoomDto) {
    const { tags, regionAName, regionBName } = updateRoomDto;

    const temp = await getConnection()
      .createQueryBuilder()
      .delete()
      .from('room_tags_tag')
      .where('roomId = :roomId', { roomId: id })
      .execute();

    console.log(temp);

    try {
      const regionA = await this.regionARepository.findOne({
        name: regionAName,
      });

      const regionB = await this.regionBRepository.findOne({
        name: regionBName,
        regionAId: regionA.id,
      });

      let roomTags: Tag[] = [];
      let joinTags: Array<object> = [];

      for (const tag of tags) {
        const findTag = await this.tagRepository.findOne({
          name: tag.toString(),
        });

        if (findTag) {
          roomTags.push(findTag);
          joinTags.push({
            roomId: id,
            tagId: findTag.id,
          });
        } else {
          const insertTag = this.tagRepository.create({
            name: tag.toString(),
          });
          await insertTag.save();
          roomTags.push(insertTag);
          joinTags.push({
            roomId: id,
            tagId: insertTag.id,
          });
        }
      }

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into('room_tags_tag')
        .values(joinTags)
        .execute();

      const room = this.roomRepository.update(id, {
        userId,
        status: new Date(updateRoomDto.startDate) <= new Date() ? 1 : 0,
        regionA: regionA.id,
        regionB: regionB.id,
      });

      // const response = await this.roomRepository.save(room);

      return {
        status: 'success',
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  /**
   * 채팅방 삭제
   * {number} userId 접속한 유저에 대한 고유식별자
   * {number} id 채팅방에 대한 고유 식별자
   */
  async deleteRoom(userId: number, id: number) {
    const findRoom = await this.roomRepository.findOne({ id, userId });

    if (findRoom.userId !== userId) {
      throw new UnauthorizedException();
    }

    findRoom.status = 2;

    try {
      await findRoom.save();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
