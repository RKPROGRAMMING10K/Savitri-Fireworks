import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface EnquiryReply {
  id: string;
  message: string;
  date: string;
  sender: string;
}

export enum EnquiryStatus {
  PENDING = 'Pending',
  CONTACTED = 'Contacted',
  RESOLVED = 'Resolved',
}

@Entity('enquiries')
export class Enquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string; // e.g. "ENQ-001"

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  enquiryType: string;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: EnquiryStatus.PENDING,
  })
  status: string;

  @Column({ type: 'boolean', default: false })
  hasAttachments: boolean;

  @Column({ type: 'text', nullable: true })
  attachmentUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  companyName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  productName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dealerName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pesoLicense: string | null;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  replies: EnquiryReply[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}

