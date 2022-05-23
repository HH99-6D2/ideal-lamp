import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from './rooms.controller';
import { Repository } from 'typeorm';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('RoomsController', () => {
  let controller: RoomsController;
  let roomsService: RoomsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [
        RoomsService,
        {
          provide: getRepositoryToken(Room),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
    roomsService = module.get<RoomsService>(RoomsService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
