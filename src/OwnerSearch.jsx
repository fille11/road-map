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
      .filter((v, i, arr) => v && arr.indexOf(v) === i) // unika + ta bort null
      .filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5); // max 5 resultat

    setResults(filtered);
  };

  const selectOwner = (owner) => {
    setFilters((prev) => ({
      ...prev,
      owner: owner,
    }));

    setQuery(owner);
    setResults([]);
  };

  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 1000,
      background: "white",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      fontFamily: "Arial"
    }}>
      
      <input
        type="text"
        placeholder="Sök väghållare..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "6px",
          width: "200px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />

      {results.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => selectOwner(r)}
              style={{
                padding: "4px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
