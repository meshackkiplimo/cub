-- Create enum type
CREATE TYPE booking_status AS ENUM ('pending', 'completed', 'cancelled');

-- Add status column to booking table
ALTER TABLE "booking"
ADD COLUMN "status" booking_status NOT NULL DEFAULT 'pending';

-- Update metadata
INSERT INTO drizzle.migrations (hash, created_at)
VALUES ('0002_add_booking_status', NOW());