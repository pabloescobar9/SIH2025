import { decimal, doublePrecision, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const waterIndiexLocation = pgTable("waterIndiexLocation", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: varchar("site_id").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waterIndiexData = pgTable("waterIndiexData", {
  id: uuid("id").primaryKey().defaultRandom(),
  locationId: uuid("location_id").notNull().references(() => waterIndiexLocation.id),
  pb: decimal("pb").notNull(),
  cd: decimal("cd").notNull(),
  as: decimal("as").notNull(),
  hg: decimal("hg").notNull(),
  cr: decimal("cr").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calculatedIndex = pgTable("calculatedIndex", {
  id: uuid("id").primaryKey().defaultRandom(),
  waterDataId: uuid("water_data_id").notNull().references(() => waterIndiexData.id),
  locationId: uuid("location_id").notNull().references(() => waterIndiexLocation.id),
  HPI: decimal("HPI").notNull(),
  HEI: decimal("HEI").notNull(),
  CF: decimal("CF").notNull(),
  PLI: decimal("PLI").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

