class CreateEmergencyContacts < ActiveRecord::Migration[5.2]
  def change
    create_table :emergency_contacts do |t|
      t.string :name
      t.string :number
      t.string :message
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
