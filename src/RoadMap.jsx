import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@supabase/supabase-js";
import Filters from "./Filters";

const SUPABASE_URL = "https://xonbkazvfxllffjbqfdm.supabase.co";
const SUPABASE_KEY = "sb_publishable_7tC9UoaV3aW3NezJeTW3Hw_IqqXI82y";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function RoadMap() {
  const mapRef = useRef(null);
  const layerRef = useRef(null); // 🔥 håller koll på lager

  const [filters, setFilters] = useState({
    owner_type: [],
    road_type: [],
  });

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([59.8586, 17.6389], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      mapRef.current = map;
    }

    async function fetchRoads() {
      const { data, error } = await supabase
        .from("roads_geojson")
        .select("*")
        .range(0, 30000);

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const geojson = {
        type: "FeatureCollection",
        features: data
          .filter((row) => {
            const ownerMatch =
              filters.owner_type.length === 0 ||
              filters.owner_type.includes(
                row.owner_type?.toLowerCase()
              );

            const roadMatch =
              filters.road_type.length === 0 ||
              filters.road_type.some((t) =>
                row.road_type?.toLowerCase().includes(t.toLowerCase())
              );

            return ownerMatch && roadMatch;
          })
          .map((row) => {
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

      // 🔥 TA BORT GAMLA LAGER
      if (layerRef.current) {
        layerRef.current.remove();
      }

      const newLayer = L.geoJSON(geojson, {
        style: {
          color: "red",
          weight: 4,
        },

        onEachFeature: (feature, layer) => {
          const props = feature.properties;
          const org = (props.org_number || "").slice(0, 11);

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
                Väginformation
              </div>

              <div style="margin-bottom: 4px;">
                <b>Typ:</b> ${props.road_type || "Okänd"}
              </div>

              <div style="margin-bottom: 4px;">
                <b>Ägare:</b> ${props.owner || "Okänd"}
              </div>

              <div style="margin-bottom: 4px;">
                <b>Ägartyp:</b> ${props.owner_type || "Okänd"}
              </div>

              <div style="margin-bottom: 4px;">
                <b>Org.nr:</b> ${org || "N/A"}
              </div>

              <div style="margin-top: 8px;">
                <a 
                  href="https://www.allabolag.se/bransch-s%C3%B6k?q=${org}" 
                  target="_blank"
                  style="color: blue; text-decoration: underline;"
                >
                  Se mer information
                </a>
              </div>

            </div>
          `;

          layer.bindPopup(popupContent);
        },
      }).addTo(mapRef.current);

      layerRef.current = newLayer;
    }

    fetchRoads();
  }, [filters]); // 🔥 VIKTIGT

  return (
    <>
      <Filters filters={filters} setFilters={setFilters} />
      <div id="map" style={{ height: "100vh", width: "100%" }} />
    </>
  );
}
