CREATE TABLE "booking" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"customer_id" serial NOT NULL,
	"car_id" serial NOT NULL,
	"booking_date" varchar(10) NOT NULL,
	"end_date" varchar(10) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "car" (
	"car_id" serial PRIMARY KEY NOT NULL,
	"make" varchar(50) NOT NULL,
	"model" varchar(50) NOT NULL,
	"year" varchar(4) NOT NULL,
	"color" varchar(20) NOT NULL,
	"availability" boolean DEFAULT true NOT NULL,
	"rental_rate" numeric(10, 2) NOT NULL,
	"location_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"customer_id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"phone" varchar(15) NOT NULL,
	"address" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "insurance" (
	"insurance_id" serial PRIMARY KEY NOT NULL,
	"car_id" serial NOT NULL,
	"provider" varchar(100) NOT NULL,
	"policy_number" varchar(50) NOT NULL,
	"start_date" varchar(10) NOT NULL,
	"end_date" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"location_id" serial PRIMARY KEY NOT NULL,
	"location_name" varchar(100) NOT NULL,
	"address" varchar(255) NOT NULL,
	"contact_number" varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance" (
	"maintenance_id" serial PRIMARY KEY NOT NULL,
	"car_id" serial NOT NULL,
	"maintenance_date" varchar(10) NOT NULL,
	"description" varchar(255) NOT NULL,
	"cost" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"booking_id" serial NOT NULL,
	"payment_date" varchar(10) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservation" (
	"reservation_id" serial PRIMARY KEY NOT NULL,
	"customer_id" serial NOT NULL,
	"car_id" serial NOT NULL,
	"start_date" varchar(10) NOT NULL,
	"end_date" varchar(10) NOT NULL,
	"return_date" varchar(10)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'customer' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_car_id_car_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."car"("car_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car" ADD CONSTRAINT "car_location_id_location_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("location_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance" ADD CONSTRAINT "insurance_car_id_car_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."car"("car_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_car_id_car_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."car"("car_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_booking_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."booking"("booking_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_customer_id_customer_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("customer_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_car_id_car_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."car"("car_id") ON DELETE cascade ON UPDATE no action;