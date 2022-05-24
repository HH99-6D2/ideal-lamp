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
  spot: string;

  @Column()
  category: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column({ type: 'tinyint', default: 0 }) // 0: 대기, 1: 활성, 2: 종료
  status: number;

  @Column()
  imageUrl: string;

  @ManyToMany(() => Tag, (tag) => tag.id, {
    cascade:true
  })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.roomId)
  like: Like;

  @ManyToOne(() => RegionA, (regionA) => regionA.id)
  @JoinColumn({
    name: 'regionA',
    referencedColumnName: 'id',
  })
  regionA: number;

  @ManyToOne(() => RegionB, (regionB) => regionB.id)
  @JoinColumn({
    name: 'regionB',
    referencedColumnName: 'id',
  })
  regionB: number;
}
