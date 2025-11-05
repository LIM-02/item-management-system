"use client";
import { FormEvent, useState, type CSSProperties } from "react";
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

  const inputStyle: CSSProperties = {
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#f1f5f9",
    borderRadius: 8,
    padding: "8px 12px",
    minWidth: 160,
    outline: "none",
  };

  const buttonStyle: CSSProperties = {
    background: "#0ea5e9",
    border: "none",
    color: "#0f172a",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Creating..." : "Add"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
