import React, { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MonitoringSite {
  id: string
  name: string
  lat: number
  lng: number
  hpi: number
  hei: number
  cf: number
  pli: number
  lastSample: string
  metals: {
    pb: number
    cd: number
    as: number
    hg: number
    cr: number
  }
}

interface ContaminationMapProps {
  sites: MonitoringSite[]
  selectedFilters: {
    dateRange: string
    metalType: string
    contamination: string
  }
}

export const ContaminationMap: React.FC<ContaminationMapProps> = ({ sites, selectedFilters }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 10)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapInstanceRef.current!.removeLayer(layer)
      }
    })

    // Filter sites based on selected filters
    const filteredSites = sites.filter(site => {
      if (selectedFilters.contamination === 'high' && site.hpi < 80) return false
      if (selectedFilters.contamination === 'medium' && (site.hpi < 40 || site.hpi > 80)) return false
      if (selectedFilters.contamination === 'low' && site.hpi > 40) return false
      return true
    })

    // Add site markers
    filteredSites.forEach(site => {
      const getMarkerColor = (hpi: number) => {
        if (hpi > 100) return '#ef4444' // Critical - red
        if (hpi > 80) return '#f97316' // Warning - orange  
        if (hpi > 40) return '#eab308' // Moderate - yellow
        return '#22c55e' // Safe - green
      }

      const getContaminationLevel = (hpi: number) => {
        if (hpi > 100) return 'Critical'
        if (hpi > 80) return 'High'
        if (hpi > 40) return 'Moderate'
        return 'Low'
      }

      // Create custom icon
      const markerHtml = `
        <div style="
          background-color: ${getMarkerColor(site.hpi)};
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `

      const customIcon = L.divIcon({
        html: markerHtml,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: 'custom-marker'
      })

      const marker = L.marker([site.lat, site.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!)

      // Add popup with detailed information
      const popupContent = `
        <div style="font-family: system-ui; min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
            ${site.name}
          </h3>
          <div style="margin-bottom: 12px;">
            <span style="
              background-color: ${getMarkerColor(site.hpi)};
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            ">
              ${getContaminationLevel(site.hpi)}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">HPI</div>
              <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${site.hpi}</div>
            </div>
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">CF</div>
              <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${site.cf}</div>
            </div>
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">HEI</div>
              <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${site.hei}</div>
            </div>
            <div style="background: #f3f4f6; padding: 8px; border-radius: 6px;">
              <div style="font-size: 12px; color: #6b7280; margin-bottom: 2px;">PLI</div>
              <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${site.pli}</div>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 13px; color: #1f2937; margin-bottom: 6px; font-weight: 500;">
              Heavy Metal Concentrations (mg/L)
            </div>
            <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
              Pb: ${site.metals.pb} | Cd: ${site.metals.cd} | As: ${site.metals.as}<br>
              Hg: ${site.metals.hg} | Cr: ${site.metals.cr}
            </div>
          </div>

          <div style="font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 8px;">
            Last sampled: ${site.lastSample}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      // Add contamination circle overlay
      const radius = Math.max(100, site.hpi * 5) // Radius based on contamination level
      L.circle([site.lat, site.lng], {
        color: getMarkerColor(site.hpi),
        fillColor: getMarkerColor(site.hpi),
        fillOpacity: 0.1,
        radius: radius,
        weight: 1
      }).addTo(mapInstanceRef.current!)
    })

    // Fit map to show all markers
    if (filteredSites.length > 0) {
      const group = new L.FeatureGroup(
        filteredSites.map(site => L.marker([site.lat, site.lng]))
      )
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }

  }, [sites, selectedFilters])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-border shadow-data"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border shadow-data">
        <h4 className="text-sm font-medium text-foreground mb-2">Contamination Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span className="text-muted-foreground">Critical (HPI &gt; 100)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-muted-foreground">High (HPI 80-100)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">Moderate (HPI 40-80)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Low (HPI &lt; 40)</span>
          </div>
        </div>
      </div>
    </div>
  )
}