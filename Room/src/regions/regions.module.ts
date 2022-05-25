import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsController } from './regions.controller';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RegionA, RegionB])],
  controllers: [RegionsController],
  providers: [RegionsService]
})
export class RegionsModule {}
