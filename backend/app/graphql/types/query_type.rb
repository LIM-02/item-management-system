# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    ITEMS = [
      { id: "1", name: "Laptop", category: "Electronics", price: 1200.0 },
      { id: "2", name: "Chair", category: "Furniture", price: 150.0 },
      { id: "3", name: "Pen", category: "Stationery", price: 3.0 },
      { id: "4", name: "Headphones", category: "Electronics", price: 200.0 },
      { id: "5", name: "Notebook", category: "Stationery", price: 5.0 },
    ].freeze

    field :items, [Types::ItemType], null: false,
      description: "List of available items in the catalogue"

    def items
      ITEMS
    end
  end
end
