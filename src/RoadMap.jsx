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
        .range(0, 30000); // 🔥 höjt till 30k

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
              ...row, // 🔥 all data
              geometry: undefined, // 🔥 tar bort dubbel geometry
            },
          };
        }),
      };

      L.geoJSON(geojson, {
  style: (feature) => {
    const type = feature.properties?.road_type?.toLowerCase();

    if (!type) {
      return { color: "gray", weight: 2 };
    }

    if (type.includes("motorväg")) {
      return { color: "red", weight: 6 };
    }

    if (type.includes("huvud")) {
      return { color: "orange", weight: 5 };
    }

    if (type.includes("lokalgata")) {
      return { color: "blue", weight: 3 };
    }

    if (type.includes("övergripande")) {
      return { color: "purple", weight: 4 };
    }

    return { color: "black", weight: 2 };
  }, // 🔥 DENNA SAKNADES

  onEachFeature: (feature, layer) => {
    layer.on("click", () => {
      console.log("PROPERTIES:", feature.properties);
    });
  },
}).addTo(map);

    fetchRoads();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
