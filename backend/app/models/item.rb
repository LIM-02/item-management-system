# frozen_string_literal: true

class Item < ApplicationRecord
  validates :name, :category, :price, presence: true
end
