import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Room } from '../entities/room.entity';

const createRoomJson = require('../../test/data/create-room.json');

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('RoomsService', () => {
  let service: RoomsService;
  let roomRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Room),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    roomRepository = module.get<MockRepository>(getRepositoryToken(Room));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('roomRepository should be defined', () => {
    expect(roomRepository).toBeDefined();
  });

  describe('createRoom()', () => {
    it('should create a room', async () => {
      createRoomJson['userId'] = 1;
      createRoomJson['status'] =
        new Date(createRoomJson.startDate) <= new Date() ? 1 : 0;
      const response = await service.createRoom(createRoomJson, 1);

      expect(response).toStrictEqual({ status: 'success' });
      // expect(service.createRoom).toHaveBeenCalledWith(createRoomJson);
    });
  });
});
