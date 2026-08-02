CREATE TYPE "BorrowReminderType" AS ENUM ('DUE_TOMORROW', 'OVERDUE');

CREATE TABLE "BorrowReminder" (
    "id" TEXT NOT NULL,
    "borrowId" TEXT NOT NULL,
    "type" "BorrowReminderType" NOT NULL,
    "reminderDay" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BorrowReminder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BorrowReminder_borrowId_type_reminderDay_key"
ON "BorrowReminder"("borrowId", "type", "reminderDay");

CREATE INDEX "BorrowReminder_reminderDay_idx" ON "BorrowReminder"("reminderDay");

ALTER TABLE "BorrowReminder"
ADD CONSTRAINT "BorrowReminder_borrowId_fkey"
FOREIGN KEY ("borrowId") REFERENCES "Borrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
