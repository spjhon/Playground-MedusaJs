import { Migration } from '@mikro-orm/migrations';

export class Migration20250524185955 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "test_table" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "test_table_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_test_table_deleted_at" ON "test_table" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "test_table" cascade;`);
  }

}
