import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MediaType {
  PHOTO = 'Photo',
  VIDEO = 'Video',
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: MediaType.PHOTO,
  })
  type: string; // 'Photo' or 'Video'

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  shortDesc: string;

  @Column({ type: 'text' })
  url: string; // MinIO public URL or direct media URL

  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  videoPlatform: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string | null;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

