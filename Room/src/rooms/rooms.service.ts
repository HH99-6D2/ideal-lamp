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
import { Not, Repository } from 'typeorm';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';
import { Tag } from '../entities/tag.entity';
import { Like } from '../entities/like.entity';
import { ResponseRoomDto } from './dto/response-room.dto';
import * as moment from 'moment-timezone';
import { JoinRoom } from '../entities/joinRoom.entity';
import { UpdateRoomDto } from './dto/update-room.dto';

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

  async getRecommendationRooms(userId: number): Promise<ResponseRoomDto[]> {
    const resRooms: ResponseRoomDto[] = [];

    const findRooms = await this.roomRepository
      .createQueryBuilder('room')
      .where({ status: Not(2) })
      .innerJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .getMany();

    console.log(findRooms);

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

      return resRooms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getRoomsByQuery(userId: number): Promise<ResponseRoomDto[]> {
    const resRooms: ResponseRoomDto[] = [];

    const findRooms = await this.roomRepository
      .createQueryBuilder('room')
      .where({ status: Not(2) })
      .innerJoinAndSelect('room.tags', 'tag')
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

      return resRooms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getRoomById(id: number, userId: number): Promise<ResponseRoomDto> {
    let resRoom: ResponseRoomDto = new ResponseRoomDto();

    const findRoom = await this.roomRepository
      .createQueryBuilder('room')
      .where({ id, status: Not(2) })
      .innerJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .getOne();

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

  async getManagementRooms(
    option: number,
    userId: number,
  ): Promise<ResponseRoomDto[]> {
    const resRooms: ResponseRoomDto[] = [];

    const findRooms = await this.roomRepository
      .createQueryBuilder('room')
      .where({ status: Not(2) })
      .innerJoinAndSelect('room.tags', 'tag')
      .innerJoinAndSelect('room.regionA', 'regionA')
      .innerJoinAndSelect('room.regionB', 'regionB')
      .getMany();

    console.log(findRooms);

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

        resRooms.push(resRoom);
      }

      return resRooms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

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
          await this.tagRepository.save(insertTag);
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

      const response = await this.roomRepository.save(room);

      return {
        status: 'success',
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  async updateRoom(updateRoomDto: UpdateRoomDto, userId: number) {
    const { tags, regionAName, regionBName } = updateRoomDto;

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
          await this.tagRepository.save(insertTag);
          roomTags.push(insertTag);
        }
      }

      const room = this.roomRepository.create({
        ...updateRoomDto,
        userId,
        status: new Date(updateRoomDto.startDate) <= new Date() ? 1 : 0,
        regionA: regionA.id,
        regionB: regionB.id,
        tags: roomTags,
      });

      const response = await this.roomRepository.save(room);

      return {
        status: 'success',
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  async deleteRoom(id: number, userId: number) {
    const findRoom = await this.roomRepository.findOne({ id, userId });

    if (findRoom.userId !== userId) {
      throw new UnauthorizedException();
    }

    findRoom.status = 2;

    try {
      this.roomRepository.save(findRoom);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
