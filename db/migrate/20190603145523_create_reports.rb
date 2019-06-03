class CreateReports < ActiveRecord::Migration[5.2]
  def change
    create_table :reports do |t|
      t.string :type
      t.string :description
      t.string :threat_level
      t.float :latitude
      t.float :longitude
      t.datetime :occurence_timedate
      t.references :user, foreign_key: true
      t.timestamps
    end
  end
end
