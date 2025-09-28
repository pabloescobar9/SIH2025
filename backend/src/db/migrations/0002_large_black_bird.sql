ALTER TABLE "calculatedIndex" RENAME COLUMN "waterDataId" TO "water_data_id";--> statement-breakpoint
ALTER TABLE "calculatedIndex" RENAME COLUMN " locationId" TO "location_id";--> statement-breakpoint
ALTER TABLE "waterIndiexData" RENAME COLUMN "locationId" TO "location_id";--> statement-breakpoint
ALTER TABLE "waterIndiexLocation" RENAME COLUMN "siteId" TO "site_id";--> statement-breakpoint
ALTER TABLE "waterIndiexLocation" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "calculatedIndex" DROP CONSTRAINT "calculatedIndex_waterDataId_waterIndiexData_id_fk";
--> statement-breakpoint
ALTER TABLE "calculatedIndex" DROP CONSTRAINT "calculatedIndex_ locationId_waterIndiexLocation_id_fk";
--> statement-breakpoint
ALTER TABLE "waterIndiexData" DROP CONSTRAINT "waterIndiexData_locationId_waterIndiexLocation_id_fk";
--> statement-breakpoint
ALTER TABLE "waterIndiexLocation" ALTER COLUMN "latitude" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "waterIndiexLocation" ALTER COLUMN "longitude" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "waterIndiexData" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "calculatedIndex" ADD CONSTRAINT "calculatedIndex_water_data_id_waterIndiexData_id_fk" FOREIGN KEY ("water_data_id") REFERENCES "public"."waterIndiexData"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculatedIndex" ADD CONSTRAINT "calculatedIndex_location_id_waterIndiexLocation_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."waterIndiexLocation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waterIndiexData" ADD CONSTRAINT "waterIndiexData_location_id_waterIndiexLocation_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."waterIndiexLocation"("id") ON DELETE no action ON UPDATE no action;