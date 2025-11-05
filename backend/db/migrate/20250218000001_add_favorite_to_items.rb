# frozen_string_literal: true

class AddFavoriteToItems < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :favorite, :boolean, default: false, null: false
    add_index :items, :favorite
  end
end
