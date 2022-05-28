import { Test, TestingModule } from '@nestjs/testing';
import { JoinRoomsService } from './join-rooms.service';

describe('JoinRoomsService', () => {
  let service: JoinRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinRoomsService],
    }).compile();

    service = module.get<JoinRoomsService>(JoinRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
