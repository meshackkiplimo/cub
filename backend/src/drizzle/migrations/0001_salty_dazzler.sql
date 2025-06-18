ALTER TABLE "car" DROP CONSTRAINT "car_location_id_location_location_id_fk";
--> statement-breakpoint
ALTER TABLE "car" ADD CONSTRAINT "car_location_id_location_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("location_id") ON DELETE cascade ON UPDATE no action;