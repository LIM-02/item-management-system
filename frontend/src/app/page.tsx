"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { FormEvent, useEffect, useMemo, useState } from "react";

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

type CreateItemResult = {
  createItem: {
    item: Item | null;
    errors: string[];
  };
};

type CreateItemVariables = {
  input: {
    name: string;
    category: string;
    price: number;
  };
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

const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      item {
        id
        name
        category
        price
      }
      errors
    }
  }
`;

export default function DashboardPage() {
  const { data, loading, error, refetch } = useQuery<GetItemsData>(GET_ITEMS);

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

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [createItem, { loading: creating, error: createError }] = useMutation<CreateItemResult, CreateItemVariables>(
    CREATE_ITEM,
    {
      onCompleted: (result) => {
        const response = result.createItem;
        if (!response) {
          setSubmissionError("Unexpected response from server.");
          return;
        }

        if (response.errors.length > 0) {
          setSubmissionError(response.errors.join(", "));
          return;
        }

        setSubmissionError(null);
        setFormError(null);
        setNewName("");
        setNewCategory("");
        setNewPrice("");
        void refetch();
      },
    },
  );

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

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newName.trim();
    const trimmedCategory = newCategory.trim();
    const parsedPrice = Number(newPrice);

    if (!trimmedName || !trimmedCategory) {
      setFormError("Name and category are required.");
      return;
    }

    if (!Number.isFinite(parsedPrice)) {
      setFormError("Price must be a valid number.");
      return;
    }

    if (parsedPrice < 0) {
      setFormError("Price cannot be negative.");
      return;
    }

    setFormError(null);
    setSubmissionError(null);

    try {
      await createItem({
        variables: {
          input: {
            name: trimmedName,
            category: trimmedCategory,
            price: parsedPrice,
          },
        },
      });
    } catch {
      setSubmissionError("Failed to create item. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Item Dashboard</h1>

      <form
        onSubmit={handleCreate}
        style={{
          display: "grid",
          gap: "8px",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginTop: "16px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "12px",
        }}
      >
        <input
          type="text"
          placeholder="Item name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          min="0"
          step="0.01"
          required
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px",
            background: "#222",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: creating ? "wait" : "pointer",
          }}
          disabled={creating}
        >
          {creating ? "Creating..." : "Add item"}
        </button>
      </form>

      {(formError || submissionError || createError) && (
        <div style={{ marginTop: "8px", color: "#b00", fontSize: "14px" }}>
          {formError ?? submissionError ?? createError?.message}
        </div>
      )}

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
