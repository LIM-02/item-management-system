"use client";

import { useState } from "react";

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

  // Filter items based on search query
  const filtered = ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Item Dashboard</h1>
      <input
        type="search"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginTop: "10px", width: "100%" }}
      />
      <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
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
