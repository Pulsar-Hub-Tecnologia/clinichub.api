import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Access from './Access';
@Entity({ name: 'workspaces' })
class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  cnpj!: string;

  @Column({ type: 'enum', enum: ['PERSONAL', 'BUSINESS'], default: 'PERSONAL' })
  type!: string;

  @Column({ nullable: true })
  picture!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: any;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  whatsapp!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ default: false })
  appointment_online!: boolean;

  @Column({ default: false })
  whatsapp_notification!: boolean;

  @Column({ default: false })
  self_register!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  address!: {
    cep: string;
    number?: number;
    street: string;
    neighborhood: string;
    city: string;
    state: {
      acronym: string;
      name: string;
    };
  };

  @OneToMany(() => Access, (access) => access.workspace)
  accesses!: Access[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Workspace;
