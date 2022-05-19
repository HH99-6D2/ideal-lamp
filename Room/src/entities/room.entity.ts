import { Tag } from './tag.entity';
import { Like } from './like.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { RegionA } from './regionA.entity';
import { RegionB } from './regionB.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 20, scale: 14, default: 0 })
  positionX: number;

  @Column({ type: 'decimal', precision: 20, scale: 14, default: 0 })
  positionY: number;

  @Column()
  cateogory: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.roomId)
  like: Like;

  @ManyToOne(() => RegionA, (regionA) => regionA.id)
  @JoinColumn({
    name: 'regionAId',
    referencedColumnName: 'id',
  })
  regionAId: number;

  @ManyToOne(() => RegionB, (regionB) => regionB.id)
  @JoinColumn({
    name: 'regionBId',
    referencedColumnName: 'id',
  })
  regionBId: number;
}
