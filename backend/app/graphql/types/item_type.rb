# frozen_string_literal: true

module Types
  class ItemType < Types::BaseObject
    description "Basic information about an item available in the catalogue"

    field :id, ID, null: false
    field :name, String, null: false
    field :category, String, null: false
    field :price, Float, null: false

    def price
      object.price.to_f
    end
  end
end
