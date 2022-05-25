import { Test, TestingModule } from '@nestjs/testing';
import { JoinRoomsController } from './join-rooms.controller';

describe('JoinRoomsController', () => {
  let controller: JoinRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoinRoomsController],
    }).compile();

    controller = module.get<JoinRoomsController>(JoinRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
