class ChangeTypeToReport < ActiveRecord::Migration[5.2]
  def change
    rename_column :reports, :type, :report_type
  end
end
