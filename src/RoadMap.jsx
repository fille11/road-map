import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@supabase/supabase-js";
import Filters from "./Filters";
import OwnerSearch from "./OwnerSearch";

const SUPABASE_URL = "https://xonbkazvfxllffjbqfdm.supabase.co";
const SUPABASE_KEY = "sb_publishable_7tC9UoaV3aW3NezJeTW3Hw_IqqXI82y";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function RoadMap() {
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  const [filters, setFilters] = useState({
    owner_type: [],
    road_type: [],
    owner: null, // 🔥 NY
  });

  const [count, setCount] = useState(0);
  const [dataState, setDataState] = useState([]);

  // 🗺️ INIT MAP (körs 1 gång)
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([59.8586, 17.6389], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      mapRef.current = map;
    }
  }, []);

  // 📦 FETCH DATA (1 gång)
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("roads_geojson")
        .select("*")
        .range(0, 30000);

      if (error) {
        console.error(error);
        return;
      }

      setDataState(data);
    }

    fetchData();
  }, []);

  // 🔥 RENDER + FILTER
  useEffect(() => {
    if (!mapRef.current || dataState.length === 0) return;

    const filtered = dataState.filter((row) => {
      const ownerTypeMatch =
        filters.owner_type.length === 0 ||
        filters.owner_type.includes(row.owner_type?.toLowerCase());

      const roadTypeMatch =
        filters.road_type.length === 0 ||
        filters.road_type.some((t) =>
          row.road_type?.toLowerCase().includes(t.toLowerCase())
        );

      const ownerMatch =
        !filters.owner ||
        row.owner?.toLowerCase() === filters.owner.toLowerCase();

      return ownerTypeMatch && roadTypeMatch && ownerMatch;
    });

    setCount(filtered.length);

    const geojson = {
      type: "FeatureCollection",
      features: filtered.map((row) => {
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

    // ta bort gamla lager
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

    // 🔥 ZOOM TILL RESULTAT
if (filtered.length > 0 && newLayer.getLayers().length > 0) {
  const bounds = L.latLngBounds([]);

  newLayer.eachLayer((layer) => {
    if (layer.getBounds) {
      bounds.extend(layer.getBounds());
    }
  });

  if (bounds.isValid()) {
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }
}

layerRef.current = newLayer;

  return (
    <>
      {/* 🔍 FILTERS */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* 🔍 OWNER SEARCH */}
      <OwnerSearch data={dataState} setFilters={setFilters} />

      {/* 🔢 ANTAL */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          zIndex: 1000,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          fontFamily: "Arial",
        }}
      >
        {count} vägar visas
      </div>

      {/* 🗺️ MAP */}
      <div id="map" style={{ height: "100vh", width: "100%" }} />
    </>
  );
}
