-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "description_ru" TEXT,
ADD COLUMN     "requirements_ru" JSONB;

-- AlterTable
ALTER TABLE "theories" ADD COLUMN     "content_ru" TEXT;
