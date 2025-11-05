"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState,useEffect } from "react";
import ItemDetail from "../components/ItemDetail";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";
import { GET_CATEGORIES, GET_ITEMS, UPDATE_ITEM } from "../graphql/queries";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

type ItemSort =
  | "NAME_ASC"
  | "NAME_DESC"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "CREATED_AT_ASC"
  | "CREATED_AT_DESC";

const SORT_OPTIONS: Array<{ value: ItemSort; label: string }> = [
  { value: "NAME_ASC", label: "Name A → Z" },
  { value: "NAME_DESC", label: "Name Z → A" },
  { value: "PRICE_ASC", label: "Price low → high" },
  { value: "PRICE_DESC", label: "Price high → low" },
  { value: "CREATED_AT_DESC", label: "Newest first" },
  { value: "CREATED_AT_ASC", label: "Oldest first" },
];

const DEFAULT_SORT: ItemSort = "NAME_ASC";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<ItemSort>(DEFAULT_SORT);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [pendingFavoriteId, setPendingFavoriteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const itemFilters = useMemo(() => {
    const trimmed = search.trim();
    return {
      search: trimmed.length > 0 ? trimmed : undefined,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      favoritesOnly,
      sort,
    };
  }, [search, selectedCategory, favoritesOnly, sort]);

  const {
    data: itemsData,
    loading: itemsLoading,
    error: itemsError,
    refetch,
  } = useQuery<{ items: Item[] }>(GET_ITEMS, {
    variables: itemFilters,
  });

  const items = useMemo(() => itemsData?.items ?? [], [itemsData]);

  const { data: categoriesData } = useQuery<{ categories: string[] }>(GET_CATEGORIES);
  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.categories ?? [];
    return ["All", ...categories];
  }, [categoriesData]);

  const [updateItem] = useMutation(UPDATE_ITEM);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedItemId(null);
      return;
    }

    if (!selectedItemId || !items.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const handleToggleFavorite = async (item: Item) => {
    setActionError(null);
    setPendingFavoriteId(item.id);

    try {
      const { data } = await updateItem({
        variables: { input: { id: item.id, favorite: !item.favorite } },
      });

      const errors = data?.updateItem.errors ?? [];
      if (errors.length > 0) {
        setActionError(errors.join(", "));
        return;
      }

      await refetch();
    } catch (err) {
      console.error(err);
      setActionError("Failed to update favourite state. Please try again.");
    } finally {
      setPendingFavoriteId(null);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, Arial, sans-serif", maxWidth: 1040, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Item Dashboard</h1>

      <ItemForm onCreated={() => refetch()} />

      <section
        style={{
          marginTop: 24,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", minWidth: 180 }}
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as ItemSort)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", minWidth: 180 }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#333" }}>
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => setFavoritesOnly(event.target.checked)}
          />
          Show favourites only
        </label>
      </section>

      <div style={{ marginTop: 12, color: "#555", fontSize: 14 }}>
        {itemsLoading && "Loading items..."}
        {itemsError && <span style={{ color: "#b91c1c" }}>Unable to load items.</span>}
        {!itemsLoading && !itemsError && `Showing ${items.length} item${items.length === 1 ? "" : "s"}`}
      </div>

      {actionError && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            borderRadius: 8,
            background: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {actionError}
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        <ItemList
          items={items}
          selectedId={selectedItemId}
          onSelect={handleSelectItem}
          onToggleFavorite={handleToggleFavorite}
          togglingId={pendingFavoriteId}
        />
        <ItemDetail
          item={selectedItem}
          onToggleFavorite={handleToggleFavorite}
          toggling={pendingFavoriteId === selectedItem?.id}
        />
      </div>
    </div>
  );
}
