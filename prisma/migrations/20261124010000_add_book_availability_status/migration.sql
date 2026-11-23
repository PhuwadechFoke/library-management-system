CREATE TYPE "BookAvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

ALTER TABLE "Book"
ADD COLUMN "availabilityStatus" "BookAvailabilityStatus" NOT NULL DEFAULT 'UNAVAILABLE';

UPDATE "Book"
SET "availabilityStatus" = CASE
  WHEN "remaining" > 0 THEN 'AVAILABLE'::"BookAvailabilityStatus"
  ELSE 'UNAVAILABLE'::"BookAvailabilityStatus"
END;
