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

  /**
   * 시/도 조회
   * {number} id 채팅방에 대한 고유 식별자
   */
  async getAllRegionA(): Promise<RegionA[]> {
    const regionAs = await this.regionARepository.find();
    return regionAs;
  }

  /**
   * 구/시 조회
   * {number} regionAId 시/도 고유 식별자
   */
  async getRegionBByAId(regionAId: number): Promise<RegionB[]> {
    const regionBs = await this.regionBRepository.find({ regionAId });
    return regionBs;
  }
}
