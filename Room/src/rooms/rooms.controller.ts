import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@ApiTags('Room API')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

}
