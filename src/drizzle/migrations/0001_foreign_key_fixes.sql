-- Fix foreign key column types
ALTER TABLE "car" 
    ALTER COLUMN "location_id" TYPE integer USING location_id::integer;

ALTER TABLE "customer" 
    ALTER COLUMN "user_id" TYPE integer USING user_id::integer;

ALTER TABLE "reservation" 
    ALTER COLUMN "customer_id" TYPE integer USING customer_id::integer,
    ALTER COLUMN "car_id" TYPE integer USING car_id::integer;

ALTER TABLE "booking" 
    ALTER COLUMN "customer_id" TYPE integer USING customer_id::integer,
    ALTER COLUMN "car_id" TYPE integer USING car_id::integer;

ALTER TABLE "payment" 
    ALTER COLUMN "booking_id" TYPE integer USING booking_id::integer;

ALTER TABLE "maintenance" 
    ALTER COLUMN "car_id" TYPE integer USING car_id::integer;

ALTER TABLE "insurance" 
    ALTER COLUMN "car_id" TYPE integer USING car_id::integer;

-- Update metadata
INSERT INTO drizzle.migrations (hash, created_at)
VALUES ('0001_foreign_key_fixes', NOW());