"use client";

import { useMemo, useState } from "react";

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

  const categories = useMemo(() => ["All", ...Array.from(new Set(ITEMS.map(i => i.category)))], []);

  const filtered = ITEMS.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const q = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Item Dashboard</h1>

      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
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
      </div>

      <div style={{ marginTop: "10px", color: "#666", fontSize: "14px" }}>
        Showing {filtered.length} of {ITEMS.length}
      </div>

      <ul style={{ marginTop: "12px", listStyle: "none", padding: 0 }}>
        {filtered.map((item) => (
          <li
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <strong>{item.name}</strong> - {item.category} (${item.price})
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p>No items found.</p>}
    </div>
  );
}
