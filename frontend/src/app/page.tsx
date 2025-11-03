"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number; 

};

// Sample data
const ITEMS: Item[] = [
  { id: "1", name: "Laptop", category: "Electronics", price: 1200 },
  { id: "2", name: "Chair", category: "Furniture", price: 150 },
  { id: "3", name: "Pen", category: "Stationery", price: 3 },
  { id: "4", name: "Headphones", category: "Electronics", price: 200 },
  { id: "5", name: "Notebook", category: "Stationery", price: 5 },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());

  // Load + save favourites in localStorage (optional, still simple)
  useEffect(() => {
    // replace with API call - fetchFavorites()
    const raw = typeof window !== "undefined" ? localStorage.getItem("favs") : null;
    if (raw) setFavs(new Set(JSON.parse(raw)));
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favs", JSON.stringify(Array.from(favs)));
    }
  }, [favs]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(ITEMS.map(i => i.category)))], []);

  const filtered = ITEMS.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const q = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchFav = !showFavOnly || favs.has(item.id);
    return matchCategory && matchSearch && matchFav;
  });

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Item Dashboard</h1>

      <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center" }}>
        <input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", minWidth: "160px" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#333" }}>
          <input
            type="checkbox"
            checked={showFavOnly}
            onChange={(e) => setShowFavOnly(e.target.checked)}
          />
          Show favourites only
        </label>
      </div>

      <div style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
        Showing {filtered.length} of {ITEMS.length}
      </div>

      <ul style={{ marginTop: "12px", listStyle: "none", padding: 0 }}>
        {filtered.map((item) => {
          const isFav = favs.has(item.id);
          return (
            <li
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.name}</strong> — {item.category} (${item.price})
              </div>
              <button
                onClick={() => toggleFav(item.id)}
                aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
                title={isFav ? "Remove from favourites" : "Add to favourites"}
                style={{
                  border: "1px solid #bbb",
                  background: isFav ? "#fff7d6" : "white",
                  color: "#333",
                  padding: "6px 10px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {isFav ? "★ Favourited" : "☆ Favourite"}
              </button>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && <p>No items found.</p>}
    </div>
  );
}
