import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileInput, MapPin, Calculator } from "lucide-react";

// TypeScript interfaces
interface Metals {
  Pb: number;
  Cd: number;
  As: number;
  Hg: number;
  Cr: number;
}

interface FormData {
  siteId: string;
  latitude: string;
  longitude: string;
  sampleDate: string;
  metals: Metals;
}

export const DataEntryPage = () => {
  const [formData, setFormData] = useState<FormData>({
    siteId: "",
    latitude: "",
    longitude: "",
    sampleDate: "",
    metals: { Pb: 0, Cd: 0, As: 0, Hg: 0, Cr: 0 },
  });

  const [indices, setIndices] = useState({
    HEI: "--",
    PLI: "--",
    HPI: "--",
    CF: { Pb: "--", Cd: "--", As: "--", Hg: "--", Cr: "--" } as Record<keyof Metals, string>,
  });

  const [loading, setLoading] = useState(false);

  const calculateIndices = async () => {
    setLoading(true);
    try {
      const payload = {
        siteId: formData.siteId,
        Latitude: parseFloat(formData.latitude),
        Longitude: parseFloat(formData.longitude),
        Pb: formData.metals.Pb,
        Cd: formData.metals.Cd,
        As: formData.metals.As,
        Hg: formData.metals.Hg,
        Cr: formData.metals.Cr,
      };

      const res = await fetch("http://localhost:3000/api/v1/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch indices");
      }

      const data = await res.json();

      setIndices({
        HEI: data.HEI.toFixed(2),
        PLI: data.PLI.toFixed(2),
        HPI: data.HPI.toFixed(2),
        CF: {
          Pb: (data.CF.Pb / 0.05).toFixed(2),
          Cd: (data.CF.Cd / 0.003).toFixed(2),
          As: (data.CF.As / 0.01).toFixed(2),
          Hg: (data.CF.Hg / 0.001).toFixed(2),
          Cr: (data.CF.Cr / 0.05).toFixed(2),
        },
      });
    } catch (err) {
      console.error("Calculation error:", err);
      alert("Error calculating indices. Check API connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleMetalChange = (metal: keyof Metals, value: string) => {
    setFormData((prev) => ({
      ...prev,
      metals: { ...prev.metals, [metal]: parseFloat(value) || 0 },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Entry</h1>
        <p className="text-muted-foreground mt-1">
          Input new water sample data and calculate pollution indices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Info */}
        <Card className="shadow-data">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Sample Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site-id">Site ID</Label>
              <Input
                id="site-id"
                value={formData.siteId}
                onChange={(e) =>
                  setFormData({ ...formData, siteId: e.target.value })
                }
                placeholder="MW-001"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="40.7128"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="-74.0060"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sample-date">Sample Date</Label>
              <Input
                id="sample-date"
                type="date"
                value={formData.sampleDate}
                onChange={(e) =>
                  setFormData({ ...formData, sampleDate: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Metal Inputs */}
        <Card className="shadow-data">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileInput className="w-5 h-5 text-secondary" />
              <span>Metal Concentrations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["Pb", "Cd", "As", "Hg", "Cr"] as (keyof Metals)[]).map(
              (metal) => (
                <div key={metal}>
                  <Label htmlFor={metal}>{metal}</Label>
                  <Input
                    id={metal}
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    value={formData.metals[metal]}
                    onChange={(e) => handleMetalChange(metal, e.target.value)}
                  />
                  <span className="text-xs text-muted-foreground">mg/L</span>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-data">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-accent" />
              <span>Calculated Indices</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Contamination Factor (CF)
                </p>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {(["Pb", "Cd", "As", "Hg", "Cr"] as (keyof Metals)[]).map(
                    (metal) => (
                      <div key={metal} className="flex flex-col items-center">
                        <span className="font-semibold">{metal}</span>
                        <span>{indices.CF[metal]}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {[
                { label: "Heavy Metal Pollution Index", value: indices.HPI },
                { label: "HEI", value: indices.HEI },
                { label: "PLI", value: indices.PLI },
              ].map((item) => (
                <div key={item.label} className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}

              <Button className="w-full" onClick={calculateIndices} disabled={loading}>
                <Calculator className="w-4 h-4 mr-2" />
                {loading ? "Calculating..." : "Calculate Indices"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
