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

    field :item, Types::ItemType, null: true,
      description: "Fetch a single item by its ID" do
      argument :id, ID, required: true
    end

    def item(id:)
      ::Item.find_by(id:)
    end

    field :items, [Types::ItemType], null: false,
      description: "List of available items in the catalogue, with optional filtering" do
      argument :search, String, required: false, description: "Match items whose name or category contains this term"
      argument :category, String, required: false, description: "Filter by an exact category name"
      argument :favorites_only, Boolean, required: false, default_value: false,
        description: "Return only favourited items when true"
    end

    def items(search: nil, category: nil, favorites_only: false)
      ::Item.filtered(
        search:,
        category: category.to_s.presence,
        favorites_only: favorites_only
      )
    end

    field :categories, [String], null: false,
      description: "Distinct categories available across all items"

    def categories
      ::Item.distinct.order(:category).pluck(:category)
    end
  end
end
