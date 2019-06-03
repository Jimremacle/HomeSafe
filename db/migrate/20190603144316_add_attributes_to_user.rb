class AddAttributesToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :frequent_address, :string
    add_column :users, :number_of_reports, :integer
    add_column :users, :user_type, :string
    add_column :users, :avatar, :string
  end
end
