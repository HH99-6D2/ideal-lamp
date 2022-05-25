import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(RegionA)
    private regionARepository: Repository<RegionA>,
    @InjectRepository(RegionB)
    private regionBRepository: Repository<RegionB>,
  ) {}

  async getAllRegionA(): Promise<RegionA[]> {
    const regionAs = await this.regionARepository.find();
    return regionAs;
  }

  async getRegionBByAId(regionAId: number): Promise<RegionB[]> {
    const regionBs = await this.regionBRepository.find({ regionAId });
    return regionBs;
  }
}
