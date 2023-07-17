-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_bossId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bossId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
