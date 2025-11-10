-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('INDIVIDUAL', 'INFLUENCER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F', 'OTHER');

-- CreateEnum
CREATE TYPE "EngagementRateTier" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CollaborationStatus" AS ENUM ('PROSPECT', 'CONTACTED', 'WARM_LEAD', 'ACTIVE', 'PAUSED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "recordType" "RecordType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT,
    "gender" "Gender",
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "country" TEXT,
    "occupation" TEXT,
    "influencerCategory" TEXT,
    "primaryPlatform" TEXT,
    "followersCount" INTEGER,
    "totalFollowersCount" INTEGER,
    "engagementRate" DOUBLE PRECISION,
    "engagementRateTier" "EngagementRateTier",
    "interests" TEXT,
    "notes" TEXT,
    "secondaryPlatform" TEXT,
    "secondaryFollowersCount" INTEGER,
    "averageMonthlyReach" INTEGER,
    "collaborationStatus" "CollaborationStatus",
    "languages" TEXT,
    "portfolioUrl" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "people_recordId_key" ON "people"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "people_email_key" ON "people"("email");

-- CreateIndex
CREATE INDEX "people_recordType_idx" ON "people"("recordType");

-- CreateIndex
CREATE INDEX "people_influencerCategory_idx" ON "people"("influencerCategory");

-- CreateIndex
CREATE INDEX "people_city_idx" ON "people"("city");

-- CreateIndex
CREATE INDEX "people_primaryPlatform_idx" ON "people"("primaryPlatform");

-- CreateIndex
CREATE INDEX "people_collaborationStatus_idx" ON "people"("collaborationStatus");

-- CreateIndex
CREATE INDEX "people_engagementRateTier_idx" ON "people"("engagementRateTier");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_influencerCategory_fkey" FOREIGN KEY ("influencerCategory") REFERENCES "categories"("name") ON DELETE SET NULL ON UPDATE CASCADE;
