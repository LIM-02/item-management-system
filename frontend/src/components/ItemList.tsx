"use client";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export default function ItemList({
  items,
  favs,
  toggleFav,
}: {
  items: Item[];
  favs: Set<string>;
  toggleFav: (id: string) => void;
}) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item) => {
        const isFav = favs.has(item.id);
        return (
          <li key={item.id} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}>
            <strong>{item.name}</strong> — {item.category} (${item.price})
            <button onClick={() => toggleFav(item.id)} style={{ marginLeft: 8 }}>
              {isFav ? "★" : "☆"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
