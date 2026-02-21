-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "acceptedByOwner" BOOLEAN,
ADD COLUMN     "ownerDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requesterDone" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Favorite_itemId_idx" ON "Favorite"("itemId");

-- CreateIndex
CREATE INDEX "Message_tradeId_idx" ON "Message"("tradeId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId");

-- CreateIndex
CREATE INDEX "Review_reviewedId_idx" ON "Review"("reviewedId");

-- CreateIndex
CREATE INDEX "ReviewImage_reviewId_idx" ON "ReviewImage"("reviewId");

-- CreateIndex
CREATE INDEX "Trade_requesterId_idx" ON "Trade"("requesterId");

-- CreateIndex
CREATE INDEX "Trade_ownerId_idx" ON "Trade"("ownerId");

-- CreateIndex
CREATE INDEX "Trade_status_idx" ON "Trade"("status");
