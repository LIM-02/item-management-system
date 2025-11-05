# frozen_string_literal: true

class Item < ApplicationRecord
  validates :name, :category, :price, presence: true

  SORT_OPTIONS = {
    "NAME_ASC" => { name: :asc },
    "NAME_DESC" => { name: :desc },
    "PRICE_ASC" => { price: :asc },
    "PRICE_DESC" => { price: :desc },
    "CREATED_AT_DESC" => { created_at: :desc },
    "CREATED_AT_ASC" => { created_at: :asc }
  }.freeze

  DEFAULT_SORT = "NAME_ASC"

  scope :favorites_only, -> { where(favorite: true) }

  class << self
    def filtered(search: nil, category: nil, favorites_only: false, sort: DEFAULT_SORT)
      scope = all
      scope = apply_search(scope, search)
      scope = scope.where(category:) if category.present?
      scope = scope.favorites_only if favorites_only
      sort_key = sort.presence || DEFAULT_SORT
      order_clause = SORT_OPTIONS.fetch(sort_key, SORT_OPTIONS[DEFAULT_SORT])
      scope.order(order_clause).order(:id)
    end

    private

    def apply_search(scope, term)
      return scope unless term.present?

      normalized = term.to_s.strip.downcase
      return scope if normalized.empty?

      pattern = "%#{sanitize_sql_like(normalized)}%"
      scope.where("LOWER(name) LIKE :pattern OR LOWER(category) LIKE :pattern", pattern:)
    end
  end
end
