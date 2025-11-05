# frozen_string_literal: true

class Item < ApplicationRecord
  validates :name, :category, :price, presence: true

  scope :favorites_only, -> { where(favorite: true) }

  class << self
    def filtered(search: nil, category: nil, favorites_only: false)
      scope = all
      scope = apply_search(scope, search)
      scope = scope.where(category:) if category.present?
      scope = scope.favorites_only if favorites_only
      scope.order(:name, :id)
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
