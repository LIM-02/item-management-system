"use client";

import { useMemo } from "react";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  favorite: boolean;
};

export default function ItemList({
  items,
  selectedId,
  onSelect,
  onToggleFavorite,
  togglingId,
}: {
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleFavorite: (item: Item) => void;
  togglingId: string | null;
}) {
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }),
    [],
  );

  if (items.length === 0) {
    return <p style={{ marginTop: 16 }}>No items match the current filters.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <li
            key={item.id}
            onClick={() => onSelect(item.id)}
            style={{
              border: "1px solid",
              borderColor: isSelected ? "#155e75" : "#ccc",
              background: isSelected ? "#f0f9ff" : "#fff",
              padding: "12px",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background 0.15s ease",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <strong style={{ fontSize: 16 }}>{item.name}</strong>
              <span style={{ fontSize: 13, color: "#555" }}>{item.category}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontWeight: 600 }}>{numberFormatter.format(item.price)}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(item);
                }}
                disabled={togglingId === item.id}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 20,
                  lineHeight: 1,
                  color: item.favorite ? "#f59e0b" : "#888",
                }}
                aria-label={item.favorite ? "Remove from favourites" : "Add to favourites"}
                title={item.favorite ? "Remove from favourites" : "Add to favourites"}
              >
                {item.favorite ? "★" : "☆"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
