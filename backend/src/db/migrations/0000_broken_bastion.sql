CREATE TABLE "calculatedIndex" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"waterDataId" uuid NOT NULL,
	" locationId" uuid NOT NULL,
	"HPI" numeric NOT NULL,
	"HEI" numeric NOT NULL,
	"CF" numeric NOT NULL,
	"PLI" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waterIndiexData" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"locationId" uuid NOT NULL,
	"pb" numeric NOT NULL,
	"cd" numeric NOT NULL,
	"as" numeric NOT NULL,
	"hg" numeric NOT NULL,
	"cr" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waterIndiexLocation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"siteId" varchar NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calculatedIndex" ADD CONSTRAINT "calculatedIndex_waterDataId_waterIndiexData_id_fk" FOREIGN KEY ("waterDataId") REFERENCES "public"."waterIndiexData"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculatedIndex" ADD CONSTRAINT "calculatedIndex_ locationId_waterIndiexLocation_id_fk" FOREIGN KEY (" locationId") REFERENCES "public"."waterIndiexLocation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waterIndiexData" ADD CONSTRAINT "waterIndiexData_locationId_waterIndiexLocation_id_fk" FOREIGN KEY ("locationId") REFERENCES "public"."waterIndiexLocation"("id") ON DELETE no action ON UPDATE no action;