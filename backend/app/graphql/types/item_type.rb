# frozen_string_literal: true

module Types
  class ItemType < Types::BaseObject
    description "Basic information about an item available in the catalogue"

    field :id, ID, null: false
    field :name, String, null: false
    field :category, String, null: false
    field :price, Float, null: false
    field :favorite, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false, description: "When the item was first created"
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false, description: "When the item was last updated"

    def price
      object.price.to_f
    end
  end
end
