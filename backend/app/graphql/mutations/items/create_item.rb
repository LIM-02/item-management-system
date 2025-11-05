# frozen_string_literal: true

module Mutations
  module Items
    class CreateItem < Mutations::BaseMutation
      description "Create a new catalogue item"

      argument :name, String, required: true
      argument :category, String, required: true
      argument :price, Float, required: true
      argument :favorite, Boolean, required: false, default_value: false

      field :item, Types::ItemType, null: true
      field :errors, [String], null: false

      def resolve(name:, category:, price:, favorite: false)
        item = ::Item.new(name:, category:, price:, favorite:)

        if item.save
          { item:, errors: [] }
        else
          { item: nil, errors: item.errors.full_messages }
        end
      end
    end
  end
end
