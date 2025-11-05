# frozen_string_literal: true

module Mutations
  module Items
    class UpdateItem < Mutations::BaseMutation
      description "Update an existing catalogue item"

      argument :id, ID, required: true
      argument :name, String, required: false
      argument :category, String, required: false
      argument :price, Float, required: false
      argument :favorite, Boolean, required: false

      field :item, Types::ItemType, null: true
      field :errors, [String], null: false

      def resolve(id:, **attributes)
        item = ::Item.find_by(id:)
        return { item: nil, errors: ["Item not found"] } unless item

        updates = attributes.compact
        return { item:, errors: [] } if updates.empty?

        if item.update(updates)
          { item:, errors: [] }
        else
          { item: nil, errors: item.errors.full_messages }
        end
      end
    end
  end
end
