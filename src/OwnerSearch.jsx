import { useState } from "react";

export default function OwnerSearch({ data, setFilters }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      return;
    }

    const filtered = data
      .map((d) => d.owner)
      .filter((v, i, arr) => v && arr.indexOf(v) === i) // unika
      .filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5);

    setResults(filtered);
  };

  const selectOwner = (owner) => {
    setFilters((prev) => ({
      ...prev,
      owner_type: [], // reset checkbox filter
      road_type: [],
      owner: owner, // 🔥 ny filter
    }));

    setResults([]);
    setQuery(owner);
  };

  return (
    <div style={{
      position: "absolute",
      top: 80,
      left: 10,
      background: "white",
      padding: "10px",
      borderRadius: "8px",
      zIndex: 1000,
      width: "220px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
    }}>
      <input
        type="text"
        placeholder="Sök väghållare..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: "100%", padding: "6px" }}
      />

      {results.map((r) => (
        <div
          key={r}
          onClick={() => selectOwner(r)}
          style={{
            padding: "5px",
            cursor: "pointer"
          }}
        >
          {r}
        </div>
      ))}
    </div>
  );
}
