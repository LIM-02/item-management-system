"use client";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ItemDetail({
  item,
  onToggleFavorite,
  toggling,
}: {
  item: Item | null;
  onToggleFavorite: (item: Item) => void;
  toggling: boolean;
}) {
  if (!item) {
    return <p>Select an item to view its details.</p>;
  }

  return (
    <section>
      <h2>{item.name}</h2>
      <p>Category: {item.category}</p>
      <p>Price: RM {item.price.toFixed(2)}</p>
      <p>Created: {item.createdAt}</p>
      <p>Last updated: {item.updatedAt}</p>
      <button type="button" onClick={() => onToggleFavorite(item)} disabled={toggling}>
        {item.favorite ? "Remove from favourites" : "Add to favourites"}
      </button>
    </section>
  );
}
