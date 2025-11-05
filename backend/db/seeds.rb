items = [
  { name: "Laptop", category: "Electronics", price: 1200.00 },
  { name: "Chair", category: "Furniture", price: 150.00 },
  { name: "Pen", category: "Stationery", price: 3.00 },
  { name: "Headphones", category: "Electronics", price: 200.00 },
  { name: "Notebook", category: "Stationery", price: 5.00 }
]

items.each do |attributes|
  Item.find_or_create_by!(name: attributes[:name]) do |item|
    item.category = attributes[:category]
    item.price = attributes[:price]
  end
end
