import { IsNotEmpty } from 'class-validator';

export class UpdateRoomDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  positionX: number;

  @IsNotEmpty()
  positionY: number;

  @IsNotEmpty()
  spot: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  regionAName: string;

  @IsNotEmpty()
  regionBName: string;

  @IsNotEmpty()
  tags: String[];
}
