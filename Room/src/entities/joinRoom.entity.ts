import { Room } from './room.entity';
import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class JoinRoom extends BaseEntity {
  @PrimaryColumn()
  roomId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Room, (room) => room.id)
  room: Room;
}
