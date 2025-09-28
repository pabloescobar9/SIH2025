import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { calculatedIndex, waterIndiexData, waterIndiexLocation } from "../db/schema.js";
import { calculateHEI, calculateHPI, calculatePLI } from "../services/calculator.js";
import {eq, desc, gt} from "drizzle-orm";


const serverStartTime = Date.now();

export const calculate = async (req: Request, res: Response) => {
  const { siteId, Latitude, Longitude, Pb, Cd, As, Hg, Cr } = req.body;

  
  if (!siteId || !Latitude || !Longitude || !Pb || !Cd || !As || !Hg || !Cr) {
    console.log("missing parameters", req.body);
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    
    const newLocation = await db
      .insert(waterIndiexLocation)
      .values({
        siteId: siteId as string,
        latitude: Latitude,
        longitude: Longitude,
        createdAt: new Date(),
      })
      .returning();

    if (!newLocation[0]) {
      return res.status(500).json({ message: "Failed to insert location" });
    }

    
    const newIndex = await db
      .insert(waterIndiexData)
      .values({
        locationId: newLocation[0].id, 
        pb: Pb,
        cd: Cd,
        as: As,
        hg: Hg,
        cr: Cr,
      })
      .returning();

    if (!newIndex[0]) {
      return res.status(500).json({ message: "Failed to insert water index data" });
    }

    // ✅ Calculate indexes
    const HPI = calculateHPI(Pb, Cd, As, Hg, Cr);
    const HEI = calculateHEI(Pb, Cd, As, Hg, Cr);
    const PLI = calculatePLI(Pb, Cd, As, Hg, Cr);

    
    const newCalc = await db
      .insert(calculatedIndex)
      .values({
        // @ts-ignore
        waterDataId: newIndex[0].id, 
        locationId: newLocation[0].id,
        HPI,
        HEI,
        CF: 0, 
        PLI,
      })
      .returning();

    
    return res.status(200).json({
      siteId,
      Latitude,
      Longitude,
      HPI,
      HEI,
      PLI,
      CF:{ Pb, Cd, As, Hg, Cr },
    });
  } catch (err: any) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "internal server error", details: err });
  }
};

export const getLocationData = async (req: Request, res: Response) => {
    try {
      const locations = await db.select().from(waterIndiexLocation);
      const results = [];
  
      for (const location of locations) {
        const waterData = await db
          .select()
          .from(waterIndiexData)
          .where(eq(waterIndiexData.locationId, location.id))
          .orderBy(desc(waterIndiexData.id))
          .limit(1); 
  
        const calculatedData = await db
          .select()
          .from(calculatedIndex)
          .where(eq(calculatedIndex.locationId, location.id))
          .orderBy(desc(calculatedIndex.id))
          .limit(1);
  
        const water = waterData[0];
        const calc = calculatedData[0];
  
        results.push({
          id: location.siteId,
          name: `Monitoring Well ${location.siteId}`,
          lat: Number(location.latitude),
          lng: Number(location.longitude),
          hpi: calc?.HPI ?? null,
          hei: calc?.HEI ?? null,
          cf: calc?.CF ?? null,
          pli: calc?.PLI ?? null,
          lastSample: water ? new Date(water.createdAt).toISOString().split("T")[0] : null,
          metals: water
            ? {
                pb: Number(water.pb),
                cd: Number(water.cd),
                as: Number(water.as),
                hg: Number(water.hg),
                cr: Number(water.cr),
              }
            : null,
        });
      }
  
      return res.status(200).json(results);
    } catch (err: any) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "internal server error", details: err });
    }
  };
  

export const getLatestAlerts = async (req: Request, res: Response) => {
  try {
    const locations = await db.select().from(waterIndiexLocation);
    const alerts: any[] = [];

    for (const location of locations) {
      const calculatedData = await db
        .select()
        .from(calculatedIndex)
        .where(eq(calculatedIndex.locationId, location.id))
        .orderBy(desc(calculatedIndex.id))
        .limit(5); 
      for (const calc of calculatedData) {
        const hpi = Number(calc.HPI);
        const hei = Number(calc.HEI);
        const pli = Number(calc.PLI);

        let alertType: "critical" | "warning" | null = null;
        let title = "";
        let value = "";
        let description = "";

        if (hpi > 100) {
          alertType = "critical";
          title = "HPI Critical Threshold Exceeded";
          value = `HPI: ${hpi}`;
          description = "Lead concentration spike detected - immediate action required";
        } else if (hei > 20) {
          alertType = "warning";
          title = "HEI Warning Threshold Exceeded";
          value = `HEI: ${hei}`;
          description = "Heavy metal contamination is high - check water quality";
        } else if (pli > 1) {
          alertType = "warning";
          title = "PLI Warning Threshold Exceeded";
          value = `PLI: ${pli}`;
          description = "Pollution load index exceeded safe limits";
        }

        if (alertType) {
          const timeDiff = Date.now() - new Date(calc.createdAt).getTime();
          const minutesAgo = Math.floor(timeDiff / 1000 / 60);

          alerts.push({
            id: calc.id,
            type: alertType,
            title,
            location: `Site ${location.siteId}`,
            time: minutesAgo < 1 ? "Just now" : `${minutesAgo} min ago`,
            value,
            description,
          });
        }
      }
    }

    alerts.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    const latestAlerts = alerts.slice(0, 5);

    return res.status(200).json(latestAlerts);
  } catch (err: any) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "internal server error", details: err });
  }
};


export const getRiskSummary = async (req: Request, res: Response) => {
  try {
    const locations = await db.select().from(waterIndiexLocation);

    let critical = 0;
    let high = 0;
    let moderate = 0;
    let low = 0;

    for (const location of locations) {
      // get latest reading for each site
      const latest = await db
        .select()
        .from(calculatedIndex)
        .where(eq(calculatedIndex.locationId, location.id))
        .orderBy(desc(calculatedIndex.createdAt))
        .limit(1);

      if (latest.length === 0) continue; // no data for this site
      const data = latest[0];

      const HPI = Number(data?.HPI);
      const HEI = Number(data?.HEI);
      const PLI = Number(data?.PLI);

      // classify site
      if (HPI > 100 || HEI > 20 || PLI > 1) {
        critical++;
      } else if (HPI > 75 || HEI > 15 || PLI > 0.8) {
        high++;
      } else if (HPI > 50 || HEI > 10 || PLI > 0.5) {
        moderate++;
      } else {
        low++;
      }
    }

    return res.status(200).json({
      criticalSites: critical,
      highRiskSites: high,
      moderateSites: moderate,
      lowRiskSites: low,
    });
  } catch (err: any) {
    console.error("Risk summary error:", err);
    return res.status(500).json({ error: "internal server error", details: err });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    
    const locations = await db.select().from(waterIndiexLocation);
    const activeSites = locations.length;

    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const samplesToday = await db
      .select()
      .from(waterIndiexData)
      .where(gt(waterIndiexData.createdAt, today));
    
    const uptimeMs = Date.now() - serverStartTime;
    const uptimeMinutes = Math.floor(uptimeMs / 1000 / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    const uptimeDays = Math.floor(uptimeHours / 24);

    const uptimeString =
      uptimeDays > 0
        ? `${uptimeDays}d ${uptimeHours % 24}h ${uptimeMinutes % 60}m`
        : `${uptimeHours}h ${uptimeMinutes % 60}m`;

    return res.status(200).json({
      activeMonitoringSites: activeSites,
      samplesToday: samplesToday.length,
      systemUptime: uptimeString,
    });
  } catch (err: any) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "internal server error", details: err });
  }
};


