"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState, useEffect } from "react";
import { GET_ITEMS } from "../graphql/queries";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

type Item = { 
  id: string; 
  name: string;
  category: string;
  price: number;
}; 

const EMPTY_ITEMS: Item[] = [];

export default function DashboardPage() {
  const { data, loading, error, refetch } = useQuery<{ items: Item[] }>(GET_ITEMS);
  const items = data?.items ?? EMPTY_ITEMS;

  // search & filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFavOnly, setShowFavOnly] = useState(false);

  // favourites
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favs", JSON.stringify(Array.from(favs)));
    }
  }, [favs]);

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const categories = useMemo(() => {
    const unique = new Set(items.map(i => i.category));
    return ["All", ...Array.from(unique)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(item => {
      const matchCategory = category === "All" || item.category === category;
      const matchSearch =
        item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const matchFav = !showFavOnly || favs.has(item.id);
      return matchCategory && matchSearch && matchFav;
    });
  }, [items, search, category, showFavOnly, favs]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Item Dashboard</h1>

      <ItemForm onCreated={refetch} />

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

      <ItemList items={filtered} favs={favs} toggleFav={toggleFav} />
    </div>
  );
}
