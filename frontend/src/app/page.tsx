"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
};

const EMPTY_ITEMS: Item[] = [];

type GetItemsData = {
  items: Item[];
};

const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      category
      price
    }
  }
`;

export default function DashboardPage() {
  const { data, loading, error } = useQuery<GetItemsData>(GET_ITEMS);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set();
    }
    try {
      const raw = window.localStorage.getItem("favs");
      return raw ? new Set<string>(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const items = data?.items ?? EMPTY_ITEMS;
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favs", JSON.stringify(Array.from(favs)));
    }
  }, [favs]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
    return ["All", ...uniqueCategories];
  }, [items]);

  const filtered = items.filter((item) => {
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
        {loading && "Loading items..."}
        {!loading && !error && `Showing ${filtered.length} of ${items.length}`}
        {error && <span style={{ color: "#c00" }}>Failed to load items.</span>}
      </div>

      <ul style={{ marginTop: "12px", listStyle: "none", padding: 0 }}>
        {loading && (
          <li style={{ padding: "10px", color: "#666" }}>Loading catalogue...</li>
        )}
        {!loading && filtered.map((item) => {
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

      {!loading && !error && filtered.length === 0 && <p>No items found.</p>}
      {error && (
        <p style={{ color: "#b00" }}>
          Unable to load items. Please try again later.
        </p>
      )}
    </div>
  );
}
