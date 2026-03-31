import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xonbkazvfxllffjbqfdm.supabase.co";
const SUPABASE_KEY = "sb_publishable_7tC9UoaV3aW3NezJeTW3Hw_IqqXI82y";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function RoadMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([59.8586, 17.6389], 12);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    async function fetchRoads() {
      const { data, error } = await supabase
        .from("roads_geojson")
        .select("*")
        .range(0, 30000);

      console.log("ANTAL:", data?.length);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const geojson = {
        type: "FeatureCollection",
        features: data.map((row) => {
          const geometry =
            typeof row.geometry === "string"
              ? JSON.parse(row.geometry)
              : row.geometry;

          return {
            type: "Feature",
            geometry,
            properties: {
              ...row,
              geometry: undefined,
            },
          };
        }),
      };

      L.geoJSON(geojson, {
        style: {
          color: "red",
          weight: 4,
        },

        onEachFeature: (feature, layer) => {
          const props = feature.properties;

          // 🔥 popup content         
           const popupContent = `
             <div style="
               font-family: Arial;
               font-size: 14px;
               min-width: 180px;
             ">
               
               <div style="
                 font-weight: bold;
                 font-size: 16px;
                 margin-bottom: 6px;
                 border-bottom: 1px solid #ddd;
                 padding-bottom: 4px;
               ">
                 🛣️ Väginfo
               </div>

               <div style="margin-bottom: 4px;">
                 <b>Typ:</b> ${props.road_type || "Okänd"}
               </div>

               <div style="margin-bottom: 4px;">
                 <b>ID:</b> ${props.id || "N/A"}
               </div>

             </div>
           `;

          layer.bindPopup(popupContent);
        },
      }).addTo(map);
    }

    fetchRoads();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
