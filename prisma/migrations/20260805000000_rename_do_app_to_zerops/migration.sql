-- AlterTable: rename doAppId → zeropsServiceId, doAppUrl → zeropsAppUrl
ALTER TABLE "Deployment" RENAME COLUMN "doAppId" TO "zeropsServiceId";
ALTER TABLE "Deployment" RENAME COLUMN "doAppUrl" TO "zeropsAppUrl";
