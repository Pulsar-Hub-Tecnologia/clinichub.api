import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createAccess1631039612324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accesses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'workspace',
            type: 'uuid',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['OWNER', 'ADMIN', 'PROFESSIONAL'],
            default: `'OWNER'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'accesses',
      new TableForeignKey({
        columnNames: ['user'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      })
    );
    await queryRunner.createForeignKey(
      'accesses',
      new TableForeignKey({
        columnNames: ['workspace'],
        referencedTableName: 'workspaces',
        referencedColumnNames: ['id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accesses');
  }
}

