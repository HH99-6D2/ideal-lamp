import { ApiResponseProperty } from '@nestjs/swagger';
export class ResponseRoomDto {
  @ApiResponseProperty({ example: 1 })
  id: number;

  @ApiResponseProperty({ example: 1 })
  userId: number;

  @ApiResponseProperty({example: '로떼이겨랑 아자아자!'})
  title: string;

  @ApiResponseProperty({example: 35.97664845766847})
  positionX: number;

  @ApiResponseProperty({example: 126.99597295767953})
  positionY: number;

  @ApiResponseProperty({example: '잠실야구장'})
  spot: string;

  @ApiResponseProperty({example: '2022-05-14 12:23:00'})
  createdDate: string;

  @ApiResponseProperty({example: '2022-05-20 14:00:00'})
  startDate: string;

  @ApiResponseProperty({example: '2022-05-20 20:00:00'})
  endDate: string;

  @ApiResponseProperty({example: '스포츠'})
  category: string;

  @ApiResponseProperty({example: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png'})
  imageUrl: string;

  @ApiResponseProperty({example: '서울'})
  regionAName: string;

  @ApiResponseProperty({example: '송파구'})
  regionBName: string;

  @ApiResponseProperty({example: ['롯데', '치맥보면서야구먹자', '아자아자!']})
  tags: String[];

  @ApiResponseProperty({example: true})
  isLike: boolean;

  @ApiResponseProperty({example: 58})
  likeCnt: number;

  @ApiResponseProperty({example: true})
  isJoined: boolean;

  @ApiResponseProperty({example: 25})
  joinCnt: number;

  @ApiResponseProperty({example: 1})
  status: number;
}
