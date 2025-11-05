# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_item, mutation: Mutations::Items::CreateItem
    field :update_item, mutation: Mutations::Items::UpdateItem
  end
end
