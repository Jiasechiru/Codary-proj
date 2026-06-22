/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `global_ai_chats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "global_ai_chats" ADD COLUMN     "context_after_message_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "global_ai_chats_user_id_key" ON "global_ai_chats"("user_id");
