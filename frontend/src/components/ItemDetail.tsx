"use client";

import { useMemo } from "react";
import type { ItemRecord } from "@/types/item";

export default function ItemDetail({
  item,
  onToggleFavorite,
  toggling,
}: {
  item: ItemRecord | null;
  onToggleFavorite: (item: ItemRecord) => void;
  toggling: boolean;
}) {
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2,
      }),
    [],
  );

  if (!item) {
    return (
      <div style={{ padding: 24, border: "1px dashed #ccc", borderRadius: 8, minHeight: 180 }}>
        <p style={{ margin: 0, color: "#666" }}>Select an item to view its details.</p>
      </div>
    );
  }

  const priceDisplay = priceFormatter.format(item.price);

  const formatDate = (value: string) => new Date(value).toLocaleString();

  return (
    <div style={{ padding: 24, border: "1px solid #155e75", borderRadius: 12}}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h2 style={{ margin: "0 0 4px" }}>{item.name}</h2>
          <span style={{ color: "#155e75", fontWeight: 600 }}>{priceDisplay}</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(item)}
          disabled={toggling}
          style={{
            border: toggling ? "1px solid #ccc" : "1px solid #f59e0b",
            background: item.favorite ? "#f59e0b" : "transparent",
            color: item.favorite ? "#fff" : "#f59e0b",
            borderRadius: 999,
            padding: "8px 16px",
            cursor: toggling ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: 600,
          }}
        >
          <span>{item.favorite ? "★" : "☆"}</span>
          {item.favorite ? "Remove from favourites" : "Add to favourites"}
        </button>
      </header>

      <dl style={{ marginTop: 16, display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 12 }}>
        <dt style={{ color: "#666" }}>Category</dt>
        <dd style={{ margin: 0 }}>{item.category}</dd>

        <dt style={{ color: "#666" }}>Created</dt>
        <dd style={{ margin: 0 }}>{formatDate(item.createdAt)}</dd>

        <dt style={{ color: "#666" }}>Last updated</dt>
        <dd style={{ margin: 0 }}>{formatDate(item.updatedAt)}</dd>
      </dl>
    </div>
  );
}
