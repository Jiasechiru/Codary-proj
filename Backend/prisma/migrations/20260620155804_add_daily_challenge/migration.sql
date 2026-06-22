-- CreateTable
CREATE TABLE "daily_challenges" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "starter_code" TEXT NOT NULL,
    "solution_code" TEXT NOT NULL,
    "tests" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_challenges" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "daily_challenge_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_challenges_user_id_date_key" ON "user_daily_challenges"("user_id", "date");

-- AddForeignKey
ALTER TABLE "user_daily_challenges" ADD CONSTRAINT "user_daily_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_challenges" ADD CONSTRAINT "user_daily_challenges_daily_challenge_id_fkey" FOREIGN KEY ("daily_challenge_id") REFERENCES "daily_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
