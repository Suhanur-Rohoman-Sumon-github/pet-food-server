-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "needPasswordChange" BOOLEAN NOT NULL DEFAULT false;
