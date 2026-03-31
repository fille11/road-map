export default function Filters({ filters, setFilters }) {
  const toggle = (type, value) => {
    setFilters((prev) => {
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      background: "white",
      padding: "10px",
      borderRadius: "8px",
      zIndex: 1000,
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
    }}>
      <h4>Filter</h4>

      <div>
        <b>Ägartyp</b><br/>
        {["statlig", "kommunal", "enskild"].map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              onChange={() => toggle("owner_type", type)}
            />
            {type}
            <br/>
          </label>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <b>Vägtyp</b><br/>
        {["Lokalgata", "Huvudväg", "Motorväg"].map((type) => (
          <label key={type}>
            <input
              type="checkbox"
              onChange={() => toggle("road_type", type)}
            />
            {type}
            <br/>
          </label>
        ))}
      </div>
    </div>
  );
}
