"use client";
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_ITEM } from "../graphql/queries";

export default function ItemForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createItem, { loading }] = useMutation(CREATE_ITEM, {
    onCompleted: () => {
      setName("");
      setCategory("");
      setPrice("");
      setIsFavorite(false);
      onCreated();
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(price);
    if (!name || !category || isNaN(parsed)) {
      setError("Please fill out all fields correctly.");
      return;
    }
    setError(null);
    await createItem({ variables: { input: { name, category, price: parsed, favorite: isFavorite } } });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Add"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
