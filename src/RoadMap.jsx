import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xonbkazvfxllffjbqfdm.supabase.co";
const SUPABASE_KEY = "sb_publishable_7tC9UoaV3aW3NezJeTW3Hw_IqqXI82y";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function RoadMap() {
  const mapRef = useRef(null); // 🔥 viktig

  useEffect(() => {
    // 🔥 STOPPA dubbel initiering
    if (mapRef.current) return;

    const map = L.map("map").setView([59.8586, 17.6389], 12);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    async function fetchRoads() {
      const { data, error } = await supabase
        .from("roads_gatutyp") // ⚠️ rätt tabell
        .select("geometry");

      console.log("DATA:", data); 

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const geojson = {
        type: "FeatureCollection",
        features: data.map((row) => ({
          type: "Feature",
          geometry:
            typeof row.geometry === "string"
              ? JSON.parse(row.geometry)
              : row.geometry,
        })),
      };

      L.geoJSON(geojson).addTo(map);
    }

    fetchRoads();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}