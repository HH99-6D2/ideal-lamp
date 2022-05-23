import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';
import { ApiTags, ApiOperation, ApiResponseProperty } from '@nestjs/swagger';

@Controller('regions')
@ApiTags('Region API')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @ApiOperation({ summary: '시/도 조회 API' })
  @ApiResponseProperty({type: RegionA})
  getAllRegionA(): Promise<RegionA[]> {
    return this.regionsService.getAllRegionA();
  }

  @Get('/:regionAId')
  @ApiOperation({ summary: '구/시 조회 API' })
  getRegionBByAId(
    @Param('regionAId', ParseIntPipe) regidonAId: number,
  ): Promise<RegionB[]> {
    return this.regionsService.getRegionBByAId(regidonAId);
  }
}
