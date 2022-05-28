import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: '로떼이겨랑 아자아자!' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 126.99597295767953 })
  @IsNotEmpty()
  positionX: number;

  @ApiProperty({ example: 35.97664845766847 })
  @IsNotEmpty()
  positionY: number;

  @ApiProperty({ example: '잠실야구장' })
  @IsNotEmpty()
  spot: string;

  @ApiProperty({ example: '2022-05-30 16:00:00' })
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2022-05-30 23:00:00' })
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: '스포츠' })
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example:
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
  })
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: '서울' })
  @IsNotEmpty()
  regionAName: string;

  @ApiProperty({ example: '송파구' })
  @IsNotEmpty()
  regionBName: string;

  @ApiProperty({ example: ['롯데', '치맥보면서야구먹자', '아자아자!'] })
  @IsNotEmpty()
  tags: String[];
}
