"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  rating: number;
  tags: string[];
  description: string;
};

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "stock-desc";
type Favorite = { itemId: string; note: string };
type FavoriteEntry = Favorite & { item: Item };

const INVENTORY: Item[] = [
  {
    id: "P-1001",
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    sku: "ELEC-001",
    price: 249.99,
    stock: 27,
    rating: 4.7,
    tags: ["audio", "bluetooth", "premium"],
    description:
      "Crystal-clear audio with a 32-hour battery life, adaptive noise cancelling, and quick charge support.",
  },
  {
    id: "P-1002",
    name: "Ergonomic Mesh Office Chair",
    category: "Furniture",
    sku: "FURN-014",
    price: 189.0,
    stock: 12,
    rating: 4.3,
    tags: ["office", "comfort", "adjustable"],
    description:
      "Adjustable lumbar support, breathable mesh back, and 4D armrests keep you comfortable in long sessions.",
  },
  {
    id: "P-1003",
    name: "4K Ultra HD Monitor 32\"",
    category: "Electronics",
    sku: "ELEC-032",
    price: 449.5,
    stock: 8,
    rating: 4.6,
    tags: ["display", "productivity", "hi-res"],
    description:
      "Stunning 4K panel with HDR10, USB-C power delivery, and a height-adjustable stand for flexible setups.",
  },
  {
    id: "P-1004",
    name: "Premium Pour-Over Coffee Kit",
    category: "Kitchen",
    sku: "HOME-022",
    price: 129.99,
    stock: 34,
    rating: 4.8,
    tags: ["coffee", "barista", "gift"],
    description:
      "Everything you need for café-quality coffee: gooseneck kettle, glass dripper, reusable filters, and scale.",
  },
  {
    id: "P-1005",
    name: "Trailblazer Waterproof Jacket",
    category: "Apparel",
    sku: "APP-101",
    price: 159.0,
    stock: 42,
    rating: 4.5,
    tags: ["outdoor", "winter", "lightweight"],
    description:
      "Lightweight shell with sealed seams, breathable membrane, and a packable hood ready for unpredictable weather.",
  },
  {
    id: "P-1006",
    name: "Smart LED Light Starter Pack",
    category: "Home",
    sku: "HOME-031",
    price: 89.99,
    stock: 58,
    rating: 4.2,
    tags: ["lighting", "smart-home", "automation"],
    description:
      "Four color-changing bulbs with Wi-Fi hub support voice assistants, scenes, and energy usage insights.",
  },
  {
    id: "P-1007",
    name: "Standing Desk Converter",
    category: "Furniture",
    sku: "FURN-028",
    price: 279.5,
    stock: 19,
    rating: 4.4,
    tags: ["office", "health", "adjustable"],
    description:
      "Transforms any desk into a sit-stand workstation with smooth pneumatic lift and ample keyboard tray.",
  },
  {
    id: "P-1008",
    name: "Precision Mechanical Keyboard",
    category: "Electronics",
    sku: "ELEC-041",
    price: 199.99,
    stock: 51,
    rating: 4.9,
    tags: ["peripherals", "rgb", "hot-swappable"],
    description:
      "Hot-swappable switches, PBT keycaps, per-key RGB, and a gasket mount plate deliver a dream typing experience.",
  },
];

const CATEGORY_OPTIONS = Array.from(new Set(INVENTORY.map((item) => item.category))).sort();

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "price-asc", label: "Price (Low → High)" },
  { value: "price-desc", label: "Price (High → Low)" },
  { value: "stock-desc", label: "Stock (High → Low)" },
];

const SORT_COMPARATORS: Record<SortOption, (a: Item, b: Item) => number> = {
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "stock-desc": (a, b) => b.stock - a.stock,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

const inventoryStockTotal = INVENTORY.reduce((total, item) => total + item.stock, 0);

export default function CompletePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(INVENTORY[0]?.id ?? null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const filteredItems = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    const activeCategorySet = new Set(selectedCategories);

    return INVENTORY.filter((item) => {
      const matchesSearch =
        needle.length === 0 ||
        [item.name, item.description, item.category, item.sku, item.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      const matchesCategory = activeCategorySet.size === 0 || activeCategorySet.has(item.category);

      return matchesSearch && matchesCategory;
    }).sort(SORT_COMPARATORS[sortOption]);
  }, [searchTerm, selectedCategories, sortOption]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedItemId(null);
      return;
    }

    const stillVisible = filteredItems.some((item) => item.id === selectedItemId);
    if (!stillVisible) {
      setSelectedItemId(filteredItems[0]?.id ?? null);
    }
  }, [filteredItems, selectedItemId]);

  const selectedItem = selectedItemId
    ? INVENTORY.find((item) => item.id === selectedItemId) ?? null
    : null;

  const favoriteEntries = useMemo(
    () =>
      favorites
        .map<FavoriteEntry | null>((favorite) => {
          const item = INVENTORY.find((candidate) => candidate.id === favorite.itemId);
          return item ? { ...favorite, item } : null;
        })
        .filter((entry): entry is FavoriteEntry => entry !== null),
    [favorites],
  );

  const favoriteIdSet = useMemo(
    () => new Set(favorites.map((favorite) => favorite.itemId)),
    [favorites],
  );

  const handleFavoriteToggle = (itemId: string) => {
    setFavorites((prev) => {
      if (prev.some((entry) => entry.itemId === itemId)) {
        return prev.filter((entry) => entry.itemId !== itemId);
      }

      return [...prev, { itemId, note: "" }];
    });
  };

  const handleNoteChange = (itemId: string, event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setFavorites((prev) =>
      prev.map((entry) => (entry.itemId === itemId ? { ...entry, note: value } : entry)),
    );
  };

  const handleKeyDown = (itemId: string) => (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((current) => current !== category) : [...prev, category],
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(240px, 320px) minmax(120px, 200px) minmax(240px, 1fr)",
        gap: "20px",
        minHeight: "100vh",
        padding: "24px",
        background: "#f5f5f7",
        color: "#1f1f24",
        fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <aside
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <header>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Inventory Intelligence
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Evaluate SKUs, track favourites, and refine discovery with precision filtering.
          </p>
        </header>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="search"
            placeholder="Search by name, SKU, or tags…"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(event) => (event.currentTarget.style.borderColor = "#6366f1")}
            onBlur={(event) => (event.currentTarget.style.borderColor = "#e2e8f0")}
          />
        </div>

        <section>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px" }}>Categories</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {CATEGORY_OPTIONS.map((category) => {
              const active = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: "1px solid",
                    borderColor: active ? "#6366f1" : "#cbd5f5",
                    background: active ? "#eef2ff" : "#f8fafc",
                    color: active ? "#312e81" : "#475569",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: active ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "10px" }}>Sort By</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {SORT_OPTIONS.map(({ value, label }) => {
              const active = sortOption === value;
              return (
                <label
                  key={value}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: active ? "#6366f1" : "#e2e8f0",
                    background: active ? "#eef2ff" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: active ? "0 10px 20px rgba(79, 70, 229, 0.15)" : "none",
                  }}
                >
                  <span style={{ color: active ? "#312e81" : "#475569", fontWeight: 600 }}>
                    {label}
                  </span>
                  <input
                    type="radio"
                    name="sort"
                    value={value}
                    checked={sortOption === value}
                    onChange={() => setSortOption(value)}
                    style={{ accentColor: "#6366f1" }}
                  />
                </label>
              );
            })}
          </div>
        </section>

        <footer
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#0f172a",
            color: "#f1f5f9",
            display: "grid",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "0.85rem", opacity: 0.75 }}>Total Stock Units</span>
          <strong style={{ fontSize: "1.8rem", fontVariantNumeric: "tabular-nums" }}>
            {inventoryStockTotal}
          </strong>
          <span style={{ fontSize: "0.9rem" }}>across {INVENTORY.length} products</span>
        </footer>
      </aside>

      <main
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "6px" }}>
              Matching Items
            </h2>
            <p style={{ color: "#64748b" }}>
              {filteredItems.length} items · Sorted by{" "}
              {SORT_OPTIONS.find((option) => option.value === sortOption)?.label}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setSelectedCategories([])}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#475569",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear filters
            </button>
            <button
              onClick={() => setFavorites([])}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "#eef2ff",
                color: "#312e81",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Clear favourites
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {filteredItems.map((item) => {
            const isActive = selectedItemId === item.id;
            const isFavorite = favoriteIdSet.has(item.id);

            return (
              <article
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                style={{
                  borderRadius: "14px",
                  padding: "16px",
                  background: isActive ? "#eef2ff" : "#f8fafc",
                  border: isActive ? "1px solid #6366f1" : "1px solid #e2e8f0",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 1fr) minmax(160px, 200px)",
                  gap: "12px",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "grid", gap: "6px" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{item.name}</h3>
                  <div style={{ display: "flex", gap: "8px", color: "#64748b", fontSize: "0.85rem" }}>
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.sku}</span>
                  </div>
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "#e2e8f0",
                          color: "#475569",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    justifyItems: "flex-end",
                    textAlign: "right",
                    color: "#0f172a",
                  }}
                >
                  <strong style={{ fontSize: "1.2rem" }}>{currencyFormatter.format(item.price)}</strong>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{item.stock} in stock</span>
                  <span style={{ color: "#fb923c", fontWeight: 600 }}>★ {item.rating}</span>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleFavoriteToggle(item.id);
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "10px",
                      border: isFavorite ? "1px solid #fbbf24" : "1px solid #e2e8f0",
                      background: isFavorite ? "#fef3c7" : "#fff",
                      color: isFavorite ? "#92400e" : "#475569",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isFavorite ? "Favorited" : "Add to favourites"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <section
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
          display: "grid",
          gap: "16px",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "6px" }}>Favourites</h2>
            <p style={{ color: "#64748b" }}>
              Capture notes about the items you want to highlight in your next campaign.
            </p>
          </div>
          <div>
            <span style={{ color: "#64748b", fontWeight: 600 }}>{favoriteEntries.length} saved</span>
          </div>
        </header>

        {favoriteEntries.length === 0 ? (
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              border: "1px dashed #cbd5f5",
              textAlign: "center",
              color: "#6366f1",
              background: "#eef2ff",
            }}
          >
            ⭐ Pin items you love to build tailored marketing stories.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {favoriteEntries.map(({ item, note }) => (
              <article
                key={item.id}
                style={{
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem" }}>{item.name}</strong>
                    <p style={{ color: "#64748b", margin: 0 }}>{item.category}</p>
                  </div>
                  <span style={{ fontWeight: 700 }}>{currencyFormatter.format(item.price)}</span>
                </div>

                <textarea
                  value={note}
                  onChange={(event) => handleNoteChange(item.id, event)}
                  onKeyDown={handleKeyDown(item.id)}
                  placeholder="What stands out about this item?"
                  style={{
                    width: "100%",
                    minHeight: "96px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    resize: "vertical",
                    fontSize: "0.95rem",
                    color: "#334155",
                    lineHeight: 1.5,
                  }}
                />

                <button
                  onClick={() =>
                    setFavorites((prev) => prev.filter((entry) => entry.itemId !== item.id))
                  }
                  style={{
                    alignSelf: "flex-end",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "1px solid #fee2e2",
                    background: "#fff",
                    color: "#b91c1c",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Remove favourite
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
