# frozen_string_literal: true

module Types
  class ItemSortEnum < Types::BaseEnum
    description "Available sort options when listing items"

    value "NAME_ASC", "Sort by name A → Z"
    value "NAME_DESC", "Sort by name Z → A"
    value "PRICE_ASC", "Sort by price low → high"
    value "PRICE_DESC", "Sort by price high → low"
    value "CREATED_AT_ASC", "Sort by oldest items first"
    value "CREATED_AT_DESC", "Sort by newest items first"
  end
end
