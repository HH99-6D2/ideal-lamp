export class ResponseRoomDto {
  id: number;

  userId: number;

  title: string;

  positionX: number;

  positionY: number;

  spot: string;

  createdDate: string;

  startDate: string;

  endDate: string;

  category: string;

  imageUrl: string;

  regionAName: string;

  regionBName: string;

  tags: String[];

  isLike: boolean;

  likeCnt: number;

  isJoined: boolean;

  joinCnt: number;

  status: number;
}
